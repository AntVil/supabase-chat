/// <reference types="cypress" />

const USERNAME = `cypress-supabase-chat${JSON.stringify(Math.random()).slice(2, 7)}`;
const EMAIL_DOMAIN = "1secmail.com";
const EMAIL = `${USERNAME}@${EMAIL_DOMAIN}`;
const PASSWORD = "12345678";

describe("sign up for mouse user", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("allows account creation", () => {
        cy.contains(":visible", "sign up", {matchCase: false}).click();

        cy.get("input:visible").first().type(EMAIL);
        cy.get("input:visible").eq(1).type(PASSWORD);
        cy.get("input:visible").eq(2).type(PASSWORD);

        cy.contains(":visible", "sign up", {matchCase: false}).click();

        // wait to ensure email was sent
        cy.wait(5000);

        // verify email
        cy.request(`https://www.1secmail.com/api/v1/?action=getMessages&login=${USERNAME}&domain=${EMAIL_DOMAIN}`).then(
            (emails) => {
                emails = emails.body;
                let lastEmailId = emails[emails.length-1].id
                cy.request(`https://www.1secmail.com/api/v1/?action=readMessage&login=${USERNAME}&domain=${EMAIL_DOMAIN}&id=${lastEmailId}`).then(
                    (email) => {
                        email = email.body;
                        let content = email.body;
                        let authLink = content.match(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/)[2];
                        authLink = authLink.replaceAll("&amp;", "&");
                        cy.request(authLink);
                    }
                );
            }
        );

        cy.contains(":visible", "sign in", {matchCase: false}).click();
    });

    it("allows profile creation", () => {
        cy.get("input:visible").first().type(EMAIL);
        cy.get("input:visible").eq(1).type(PASSWORD);
        
        cy.contains(":visible", "sign in", {matchCase: false}).click();
        
        // using get to retry until element is visible
        cy.get("input[placeholder*='username']").should("be.visible").first().type(USERNAME);

        cy.contains(":visible", "create profile", {matchCase: false}).click();

        cy.contains(":visible", USERNAME, {matchCase: false});
    });

    it("allows account deletion", () => {
        cy.get("input:visible").first().type(EMAIL);
        cy.get("input:visible").eq(1).type(PASSWORD);
        
        cy.contains(":visible", "sign in", {matchCase: false}).click();
        
        cy.get("label[for='settingsScreen']").should("be.visible").click();

        cy.contains(":visible", "delete").click();

        cy.get("[onclick]").last().click();
    });

    it("account deletion is successful", () => {
        cy.get("input:visible").first().type(EMAIL);
        cy.get("input:visible").eq(1).type(PASSWORD);
        
        cy.contains(":visible", "sign in", {matchCase: false}).click();
        
        cy.get("input:visible").first().should("have.class", "fieldInvalid");
        cy.get("input:visible").eq(1).should("have.class", "fieldInvalid");
    });
});
