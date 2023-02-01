/// <reference types="cypress" />

const USERNAME = `cypress-supabase-chat`;
const EMAIL_DOMAIN = "1secmail.com";
const EMAIL = `${USERNAME}@${EMAIL_DOMAIN}`;
const PASSWORD = "12345678";

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

    it("can sign in", () => {
        cy.get("input:visible").first().type(EMAIL);
        
        cy.get("input:visible").eq(1).type(PASSWORD);
        
        cy.contains(":visible", "sign in", {matchCase: false}).click();

        cy.get("[placeholder='message']", { timeout: 1000 }).should("be.visible");
    });

    it("can sign out", () => {
        cy.get("input:visible").first().type(EMAIL);
        
        cy.get("input:visible").eq(1).type(PASSWORD);
        
        cy.contains(":visible", "sign in", {matchCase: false}).click();

        cy.get("[for='settingsScreen']", { timeout: 1000 }).should("be.visible").click();

        cy.contains(":visible", "settings", {matchCase: false}).siblings().last().click();

        cy.contains("Login", {matchCase: false}).should("be.visible");
    });
});
