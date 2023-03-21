/* eslint-disable no-undef */

const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;
const extractCSRFToken = (html) => {
  const $ = cheerio.load(html.text);
  return $('[name="_csrf"]').val();
};
const extractCompletionStatus = (html) => {
  const $ = cheerio.load(html.text);
  return $('input[type="checkbox"]').prop("checked");
};
const extractTodoId = (html) => {
  const $ = cheerio.load(html.text);
  return $('input[type="checkbox"]').attr("id");
};
const extractTodoItems = (html) => {
  const $ = cheerio.load(html.text);
  return $('input[type="checkbox"]').length;
};

const login = async (agent, email, password) => {
  const res = await agent.get("/login");
  const csrfToken = extractCSRFToken(res);
  await agent.post("/sessions").send({
    email,
    password,
    _csrf: csrfToken,
  });
};
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Check if index page is available", async () => {
    const res = await agent.get("/");
    expect(res.statusCode).toBe(200);
  });

  test("Sign up as a new user 1", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCSRFToken(res);
    res = await agent.post("/users").send({
      firstname: "Tony",
      lastname: "Stark",
      email: "tonystark@test.com",
      password: "password",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/todos");
  });

  test("Sign out of user 1", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/");
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/login");
  });

  test("Sign up as a new user 2", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCSRFToken(res);
    res = await agent.post("/users").send({
      firstname: "John",
      lastname: "Wick",
      email: "johnwick@test.com",
      password: "password",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/todos");
  });

  test("Sign out of user 2", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/");
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/login");
  });

  test("Create a Todo-Item as user 1", async () => {
    const agent = request.agent(server);
    await login(agent, "tonystark@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCSRFToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
    expect(extractTodoItems(await agent.get("/todos"))).toBe(1);
  });

  test("Create a Todo-Item as user 2", async () => {
    const agent = request.agent(server);
    await login(agent, "johnwick@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCSRFToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
    const res2 = await agent.get("/todos");
    console.warn(res2);
    expect(extractTodoItems(await agent.get("/todos"))).toBe(1);
  });

  test("Update a Todo-Item as complete as user 1", async () => {
    const agent = request.agent(server);
    await login(agent, "tonystark@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCSRFToken(res);
    expect(extractCompletionStatus(res)).toBe(false);
    await agent.put(`/todos/${extractTodoId(res)}`).send({
      completed: true,
      _csrf: csrfToken,
    });
    expect(extractCompletionStatus(await agent.get("/todos"))).toBe(true);
  });

  test("Update a Todo-Item as incomplete as user 1", async () => {
    const agent = request.agent(server);
    await login(agent, "tonystark@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCSRFToken(res);
    expect(extractCompletionStatus(res)).toBe(true);
    await agent.put(`/todos/${extractTodoId(res)}`).send({
      completed: false,
      _csrf: csrfToken,
    });
    expect(extractCompletionStatus(await agent.get("/todos"))).toBe(false);
  });

  test("Delete a Todo-Item as user 1 ", async () => {
    const agent = request.agent(server);
    await login(agent, "tonystark@test.com", "password");
    const res = await agent.get("/todos");
    const csrfToken = extractCSRFToken(res);
    expect(extractTodoItems(res)).toBe(1);
    await agent.delete(`/todos/${extractTodoId(res)}`).send({
      completed: true,
      _csrf: csrfToken,
    });
    expect(extractTodoItems(await agent.get("/todos"))).toBe(0);
  });

  test("Todo-Item of users are isolated", async () => {
    let agent = request.agent(server);
    await login(agent, "johnwick@test.com", "password");
    let res = await agent.get("/todos");
    expect(extractTodoItems(res)).toBe(1);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/");
    agent = request.agent(server);
    await login(agent, "tonystark@test.com", "password");
    res = await agent.get("/todos");
    expect(extractTodoItems(res)).toBe(0);
  });
});
