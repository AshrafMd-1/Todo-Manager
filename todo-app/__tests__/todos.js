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

  test("Create a Todo-Item", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCSRFToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Update a Todo-Item as complete", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCSRFToken(res);
    expect(extractCompletionStatus(res)).toBe(false);
    await agent.put(`/todos/${extractTodoId(res)}`).send({
      completed: true,
      _csrf: csrfToken,
    });
    expect(extractCompletionStatus(await agent.get("/"))).toBe(true);
  });

  test("Update a Todo-Item as incomplete", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCSRFToken(res);
    expect(extractCompletionStatus(res)).toBe(true);
    await agent.put(`/todos/${extractTodoId(res)}`).send({
      completed: false,
      _csrf: csrfToken,
    });
    expect(extractCompletionStatus(await agent.get("/"))).toBe(false);
  });

  test("Delete a Todo-Item ", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCSRFToken(res);
    expect(extractTodoItems(res)).toBe(1);
    await agent.delete(`/todos/${extractTodoId(res)}`).send({
      completed: true,
      _csrf: csrfToken,
    });
    expect(extractTodoItems(await agent.get("/"))).toBe(0);
  });
});
