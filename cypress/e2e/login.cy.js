/* eslint-disable no-undef */

describe("Login Testing", () => {
  before(() => {
    cy.visit("http://localhost:3000");
    cy.get("button").contains("Sign Up").click();
    cy.get("#firstname").type("John-login");
    cy.get("#email").type("john_login@test.com");
    cy.get("#password").type("password-login");
    cy.get("button").contains("Sign Up").click();
    cy.url().should("eq", "http://localhost:3000/todos");
    cy.get("#logout").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#login").click();
  });

  it("Check if homepage route is working", () => {
    cy.get("#homepage").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("Check if redirecting to signup page works properly", () => {
    cy.get("#signup").click();
    cy.url().should("eq", "http://localhost:3000/signup");
  });

  it("Login doesnt accept empty form", () => {
    cy.get("button").contains("Login").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Missing credentials");
    });
  });

  it("Login with only password", () => {
    cy.get("#password").type("password-login");
    cy.get("button").contains("Login").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Missing credentials");
    });
  });

  it("Login with wrong email", () => {
    cy.get("#email").type("john_login1@test.com");
    cy.get("#password").type("password-login");
    cy.get("button").contains("Login").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Incorrect email.");
    });
  });

  it("Login with wrong password", () => {
    cy.get("#email").type("john_login@test.com");
    cy.get("#password").type("password-login1");
    cy.get("button").contains("Login").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Incorrect password.");
    });
  });

  it("Login with correct details", () => {
    cy.get("#email").type("john_login@test.com");
    cy.get("#password").type("password-login");
    cy.get("button").contains("Login").click();
    cy.url().should("eq", "http://localhost:3000/todos");
  });
});
