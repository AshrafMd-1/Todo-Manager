/* eslint-disable no-undef */

describe("Signup Testing", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get("#signup").click();
  });

  it("Check if homepage route is working", () => {
    cy.get("#homepage").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("Check if redirecting to login works properly", () => {
    cy.get("#login").click();
    cy.url().should("eq", "http://localhost:3000/login");
  });

  it("Signup doesnt accept empty form", () => {
    cy.get("button").contains("Sign Up").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Password cannot be empty");
    });
  });

  it("Signup with only password", () => {
    cy.get("#password").type("password-signup");
    cy.get("button").contains("Sign Up").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("First name is required");
    });
  });

  it("Signup with first name and password", () => {
    cy.get("#firstname").type("John-signup");
    cy.get("#password").type("password-signup");
    cy.get("button").contains("Sign Up").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Email is invalid");
    });
  });

  it("Signup doesnt accept wrong email format", () => {
    cy.get("#firstname").type("John-signup");
    cy.get("#email").type("john_signup");
    cy.get("#password").type("password-signup");
    cy.get("button").contains("Sign Up").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Email is invalid");
    });
  });

  it("Signup with correct details", () => {
    cy.get("#firstname").type("John-signup");
    cy.get("#email").type("john_signup@test.com");
    cy.get("#password").type("password-signup");
    cy.get("button").contains("Sign Up").click();
    cy.url().should("eq", "http://localhost:3000/todos");
  });

  it("Signup with existing email", () => {
    cy.get("#firstname").type("John-signup");
    cy.get("#email").type("john_signup@test.com");
    cy.get("#password").type("password-signup");
    cy.get("button").contains("Sign Up").click();
    cy.get("#notify-error").then(($el) => {
      expect($el.text().trim()).to.equal("Email already exists");
    });
  });
});
