/// <reference types="cypress" />

const USERNAME = `cypress-supabase-chat${JSON.stringify(Math.random()).slice(2, 7)}`;
const EMAIL_DOMAIN = "1secmail.com";
const EMAIL = `${USERNAME}@${EMAIL_DOMAIN}`;
const PASSWORD = "12345678";

describe("account management for keyboard user", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("allows account creation", () => {
        cy.createAccountKeyboard(USERNAME, EMAIL_DOMAIN, PASSWORD);
    });

    it("allows account deletion", () => {
        cy.deleteAccountKeyboard(USERNAME, EMAIL_DOMAIN, PASSWORD);
    });

    it("account deletion is successful", () => {
        cy.loginKeyboard(USERNAME, EMAIL_DOMAIN, PASSWORD);
        
        cy.get("input:visible").first().should("have.class", "fieldInvalid");
        cy.get("input:visible").eq(1).should("have.class", "fieldInvalid");
    });
});
