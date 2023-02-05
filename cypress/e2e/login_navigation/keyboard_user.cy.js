/// <reference types="cypress" />

describe("login navigation for keyboard user", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("starts at login", () => {
        cy.contains("Login", {matchCase: false}).should("be.visible");
    });
    
    it("navigates back to sign in", () => {
        cy.get("body").tab().tab().tab().tab().type("{enter}");
        cy.contains("Create Account").should("be.visible");

        cy.get("body").tab().tab().tab().tab().tab().type("{enter}");
        cy.contains("Login", {matchCase: false}).should("be.visible");
    });
});
