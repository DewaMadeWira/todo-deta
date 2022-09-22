// install express with `npm install express`
const express = require("express");
const app = express();
const { Deta } = require("deta");
app.use(express.json());
const methodOverride = require("method-override");
// const mainRoute = require("./routes/main");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const deta = Deta();

const db = deta.Base("todo_db");

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const toCreate = { username, email, password, todos: [{}] };
  const insertedUser = await db.put(toCreate);
  res.status(201).json(insertedUser);
});

app.post("/todos", async (req, res) => {
  const { title, due, task } = req.body;
  const toCreate = { title, due, task };
  const insertedUser = await db.put(toCreate);
  res.redirect("/login");
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const { user } = await db.fetch({ username: username, password: password });
  if (user != null) {
    res.redirect("/:");
  }
  // user.forEach((element) => {
  //   if (element.username == username) {
  //     if (element.password == password) {
  //       res.send("You are logged in !");
  //     }
  //   } else {
  //     res.send("Wrong credentials");
  //   }
  // });
});

app.get("/try", async (req, res) => {
  return (await db.fetch({ "username": "Kadal" }).next()).value;

  // const id = req.params.id;
  // const user = await db.get(id);
  // if (user) {
  //   res.send("You are logged in !");
  // } else {
  //   res.status(404).json({ message: "user not found" });
  // }
});

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todos = await db.get(id);
  if (todos) {
    res.render("todos", { todos: todos });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

app.get("/todos/edit/:id", async (req, res) => {
  const { id } = req.params;
  const todos = await db.get(id);
  if (todos) {
    res.render("edit", { todos: todos, id: id });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, due, task } = req.body;
  const toPut = { key: id, title, due, task };
  const newItem = await db.put(toPut);
  return res.redirect(`/todos/${id}`);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await db.delete(id);
  return res.redirect(`/todos/${id}`);
});
// export 'app'
module.exports = app;
