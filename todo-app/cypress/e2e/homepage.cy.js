/* eslint-disable no-undef */

describe("Homepage Testing", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Check if we are in home page", () => {
    cy.url().should("eq", "http://localhost:3000/");
    cy.get("h1").should("have.text", "Welcome To the To-Do manager");
  });

  it("Redirect to login page", () => {
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/login");
  });

  it("Redirect to signup page", () => {
    cy.get("#signup").click();
    cy.url().should("eq", "http://localhost:3000/signup");
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });
});
