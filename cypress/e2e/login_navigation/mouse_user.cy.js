/// <reference types="cypress" />

describe("login navigation for mouse user", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("starts at login", () => {
        cy.contains("Login", {matchCase: false}).should("be.visible");
    });
    
    it("navigates to sign up and back", () => {
        cy.contains(":visible", "sign up", {matchCase: false}).click();
        cy.contains("Create Account").should("be.visible");

        cy.contains(":visible", "sign in", {matchCase: false}).click();
        cy.contains("Login", {matchCase: false}).should("be.visible");
    });
});
