const express = require("express");
const bodyParser = require("body-parser");
const csurf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
const path = require("path");
const { Todo } = require("./models");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));

app.use(cookieParser("A secret string"));
app.use(csurf("2r~h8B_]{eb8n!CQ6-m~I>E:9B,#43XE", ["POST", "PUT", "DELETE"]));

app.get("/", async (request, response) => {
  console.log("Processing list of all Todos ...");
  try {
    const overdue = await Todo.overdueTodos();
    const today = await Todo.todayTodos();
    const later = await Todo.laterTodos();
    const completed = await Todo.completedTodos();
    response.render("index", {
      overdueTodos: overdue,
      todayTodos: today,
      laterTodos: later,
      completedTodos: completed,
      overdueCount: overdue.length,
      todayCount: today.length,
      laterCount: later.length,
      completedCount: completed.length,
      csrfToken: request.csrfToken(),
    });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  console.log("Processing a specific Todo with ID: ", request.params.id);
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  console.log("Processing a new Todo with title: ", request.body.title);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  console.log("Marking a Todo as completed with ID: ", request.params.id);
  try {
    const todo = await Todo.findByPk(request.params.id);
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("Delete a Todo with the ID: ", request.params.id);
  try {
    await Todo.removeTodo({ id: request.params.id });
    return response.json({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
