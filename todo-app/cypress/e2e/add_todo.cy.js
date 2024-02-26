/* eslint-disable no-undef */

describe("Add Todo", () => {
  before(() => {
    cy.wait(5000);
    cy.visit("http://localhost:3000");
    cy.get("button").contains("Sign Up").click();
    cy.get("#firstname").type("John-add");
    cy.get("#email").type("john_add@test.com");
    cy.get("#password").type("password-add");
    cy.get("button").contains("Sign Up").click();
    cy.url().should("eq", "http://localhost:3000/todos");
    cy.get("#logout").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#login").click();
    cy.get("#email").type("john_add@test.com");
    cy.get("#password").type("password-add");
    cy.get("button").contains("Login").click();
    cy.url().should("eq", "http://localhost:3000/todos");
  });

  it("Todo form must not be empty", () => {
    cy.get("button").contains("Add").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Title is required");
    });
  });

  it("Todo form should not accept only title", () => {
    cy.get("#todo").type("Todo 1");
    cy.get("button").contains("Add").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Due date must be a valid date");
    });
  });

  it("Todo form should not accept only due date", () => {
    cy.get("#date").type("2021-12-12");
    cy.get("button").contains("Add").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Title is required");
    });
  });

  it("Todo form should accept correct details", () => {
    cy.get("#todo").type("Todo 2");
    cy.get("#date").type("2021-12-14");
    cy.get("button").contains("Add").click();
    cy.get("#notify-success").then(($el) => {
      expect($el.text().trim()).to.equal("Todo added successfully");
    });
  });

  it("check if logout works", () => {
    cy.get("#logout").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});
