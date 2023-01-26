/// <reference types="cypress" />

describe("login navigation for keyboard user", () => {
    beforeEach(() => {
        cy.visit("/");
    })

    it("starts at login", () => {
        cy.contains("Login", {matchCase: false}).should("be.visible");
    })
    
    it("navigates back to sign in", () => {
        cy.get("body").tab().tab().tab().tab().type("{enter}");
        cy.contains("Create Account").should("be.visible");

        cy.get("body").tab().tab().tab().tab().tab().type("{enter}");
        cy.contains("Login", {matchCase: false}).should("be.visible");
    })

    it("can sign in", () => {
        cy.fixture("user_email").then(email => {
            cy.get("body").tab().type(email);
        })
        
        cy.fixture("user_password").then(password => {
            cy.get("body").tab().tab().type(password);
        })
        
        cy.get("body").tab().tab().tab().type("{enter}");

        cy.get("[placeholder='message']", {timeout: 1000}).should("be.visible");
    })

    it("can sign out", () => {
        cy.fixture("user_email").then(email => {
            cy.get("input:visible").first().type(email);
        })
        
        cy.fixture("user_password").then(password => {
            cy.get("input:visible").eq(1).type(password);
        })
        
        cy.get("body").tab().tab().tab().type("{enter}");

        cy.get("[for='settingsScreen']", {timeout: 1000}).should("be.visible");

        // wait to ensure tab works correctly
        cy.wait(1000);
        cy.get("body").tab().type("{enter}");

        let tabs = cy.get("body");
        cy.contains(":visible", "settings", {matchCase: false}).siblings().each(() => {
            tabs = tabs.tab();
        });
        tabs.type("{enter}");

        cy.contains("Login", {matchCase: false}).should("be.visible");
    })
})
