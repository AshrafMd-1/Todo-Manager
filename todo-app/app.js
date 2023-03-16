const express = require("express");
const bodyParser = require("body-parser");
const csurf = require("tiny-csrf");
const cookieParser = require("cookie-parser");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

const path = require("path");
const { Todo } = require("./models");
const { User } = require("./models");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));

app.use(cookieParser('h4}A~`yes"A]?87F/zc!'));
app.use(csurf("2r~h8B_]{eb8n!CQ6-m~I>E:9B,#43XE", ["POST", "PUT", "DELETE"]));

app.use(
  session({
    secret: "3#KFqTZJHxABh@M|95nc0u./zR%^qC_j/",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      User.findOne({
        where: {
          email,
        },
      })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done("Invalid email or password");
          }
        })
        .catch((error) => {
          return error;
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error);
    });
});

app.get("/", async (request, response) => {
  response.render("index", { csrfToken: request.csrfToken() });
});

app.get("/signup", (request, response) => {
  response.render("signup", {
    csrfToken: request.csrfToken(),
  });
});

app.post("/users", async (request, response) => {
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPassword,
    });
    request.login(user, (error) => {
      if (error) {
        console.log(error);
        return response.status(422).json(error);
      }
      return response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/login", (request, response) => {
  response.render("login", {
    csrfToken: request.csrfToken(),
  });
});

app.post(
  "/sessions",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (request, response) => {
    response.redirect("/todos");
  }
);

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Processing list of all Todos ...");
    const loggedUser = request.user.id;
    try {
      const overdue = await Todo.overdueTodos(loggedUser);
      const today = await Todo.todayTodos(loggedUser);
      const later = await Todo.laterTodos(loggedUser);
      const completed = await Todo.completedTodos(loggedUser);
      response.render("todos", {
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
  }
);

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("Processing a new Todo with title: ", request.body.title);
    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        UserId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("Marking a Todo as completed with ID: ", request.params.id);
    try {
      const todo = await Todo.findOne({
        where: {
          id: request.params.id,
          UserId: request.user.id,
        },
      });
      const updatedTodo = await todo.setCompletionStatus(
        request.body.completed
      );
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("Delete a Todo with the ID: ", request.params.id);
    try {
      await Todo.removeTodo({
        id: request.params.id,
        UserId: request.user.id,
      });
      return response.json({ success: true });
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.get("/signout", (request, response, next) => {
  request.logout((error) => {
    if (error) {
      console.log(error);
      return next(error);
    }
    return response.redirect("/");
  });
});

module.exports = app;
