/* eslint-disable no-undef */

describe("Manage Todo", () => {
  before(() => {
    cy.visit("http://localhost:3000");
    cy.get("button").contains("Sign Up").click();
    cy.get("#firstname").type("John-manage");
    cy.get("#email").type("john_manage@test.com");
    cy.get("#password").type("password-manage");
    cy.get("button").contains("Sign Up").click();
    cy.url().should("eq", "http://localhost:3000/todos");
    cy.get("#logout").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#login").click();
    cy.get("#email").type("john_manage@test.com");
    cy.get("#password").type("password-manage");
    cy.get("button").contains("Login").click();
    cy.url().should("eq", "http://localhost:3000/todos");
  });

  it("Create a dummy todo", () => {
    cy.get("#todo").type("Todo 3");
    cy.get("#date").type("2022-12-14");
    cy.get("button").contains("Add").click();
    cy.get("#notify-success").then(($el) => {
      expect($el.text().trim()).to.equal("Todo added successfully");
    });
  });

  it("Check if todo is added", () => {
    cy.get("label").contains("Todo 3");
  });

  it("Check if todo is completed", () => {
    cy.get("input[type=checkbox]").check();
    cy.get("#notify-success").then(($el) => {
      expect($el.text().trim()).to.equal("Todo updated successfully");
    });
  });

  it("Check if todo is deleted", () => {
    cy.get(".delete-todo").click();
    cy.get("#notify-success").then(($el) => {
      expect($el.text().trim()).to.equal("Todo deleted successfully");
    });
  });
});
