/// <reference types="cypress" />

const USERNAME = `cypress-supabase-chat${JSON.stringify(Math.random()).slice(2, 7)}`;
const EMAIL_DOMAIN = "1secmail.com";
const EMAIL = `${USERNAME}@${EMAIL_DOMAIN}`;
const PASSWORD = "12345678";

describe("sign up for keyboard user", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("allows account creation", () => {
        cy.get("body").tab().tab().tab().tab().type("{enter}");
        cy.contains("Create Account").should("be.visible");

        cy.get("body").tab().type(EMAIL);
        cy.get("body").tab().tab().type(PASSWORD);
        cy.get("body").tab().tab().tab().type(PASSWORD);
        cy.get("body").tab().tab().tab().tab().type("{enter}");

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

        cy.get("body").tab().type("{enter}");
    });

    it("allows profile creation", () => {
        cy.get("body").tab().type(EMAIL);
        cy.get("body").tab().tab().type(PASSWORD);
        cy.get("body").tab().tab().tab().type("{enter}");
        
        // waiting for element to be visible
        cy.wait(1000);
        cy.get("body").tab().type(USERNAME);
        cy.get("body").tab().tab().type("{enter}");

        cy.contains(":visible", USERNAME, {matchCase: false});
    });

    it("allows account deletion", () => {
        cy.get("body").tab().type(EMAIL);
        cy.get("body").tab().tab().type(PASSWORD);
        cy.get("body").tab().tab().tab().type("{enter}");
        
        cy.wait(1000);
        cy.get("body").tab().type("{enter}");
        
        cy.contains(":visible", "delete").should("have.attr", "tabindex");
        cy.contains(":visible", "delete").click();

        cy.get("[onclick]").last().should("have.attr", "tabindex");
        cy.get("[onclick]").last().click();
    });

    it("account deletion is successful", () => {
        cy.get("body").tab().type(EMAIL);
        cy.get("body").tab().tab().type(PASSWORD);
        cy.get("body").tab().tab().tab().type("{enter}");
        
        cy.get("input:visible").first().should("have.class", "fieldInvalid");
        cy.get("input:visible").eq(1).should("have.class", "fieldInvalid");
    });
});
