const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));

app.get("/", async (request, response) => {
  console.log("Processing list of all Todos ...");
  try {
    const overdue = await Todo.overdueTodos();
    const today = await Todo.todayTodos();
    const later = await Todo.laterTodos();
    if (request.accepts("html")) {
      response.render("index", {
        overdueTodos: overdue,
        todayTodos: today,
        laterTodos: later,
        overdueCount: overdue.length,
        todayCount: today.length,
        laterCount: later.length,
      });
    } else {
      return response.json({
        overdueTodos: overdue,
        todayTodos: today,
        laterTodos: later,
        overdueCount: overdue.length,
        todayCount: today.length,
        laterCount: later.length,
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE
  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
  const allTodos = await Todo.findAll();
  response.json(allTodos);
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
    const updatedTodo = await todo.setCompletionStatus(
      request.body.completed ? 1 : 0
    );
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
