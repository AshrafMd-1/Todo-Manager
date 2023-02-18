/* eslint-disable no-undef */
const todoList = require("../todo");
const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("Todo Test Suite", () => {
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };
  let dateToday = new Date();
  const today = formattedDate(dateToday);
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  );
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  );
  beforeAll(() => {
    add({ title: "Submit assignment", dueDate: yesterday, completed: false });
    add({ title: "Pay rent", dueDate: today, completed: true });
    add({ title: "Service Vehicle", dueDate: today, completed: false });
    add({ title: "File taxes", dueDate: tomorrow, completed: false });
    add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });
  });
  test("Check New Todo", () => {
    const prev = all.length;
    add({ title: "Add new todo", dueDate: tomorrow, completed: false });
    expect(all.length).toBe(prev + 1);
  });
  test("Mark Todo As Complete ", () => {
    markAsComplete(3);
    expect(all[3]["completed"]).toBe(true);
  });
  test("Retrieval Of Overdue Items", () => {
    const over = overdue();
    expect(over.length).toBe(1);
  });
  test("Retrieval Of Today Items", () => {
    const today = dueToday();
    expect(today.length).toBe(2);
  });
  test("Retrieval Of Later Items", () => {
    const later = dueLater();
    expect(later.length).toBe(3);
  });
});
