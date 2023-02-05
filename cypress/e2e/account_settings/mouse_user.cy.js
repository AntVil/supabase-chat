/// <reference types="cypress" />

const USERNAME = `cypress-supabase-chat${JSON.stringify(Math.random()).slice(2, 7)}`;
const EMAIL_DOMAIN = "1secmail.com";
const EMAIL = `${USERNAME}@${EMAIL_DOMAIN}`;
const PASSWORD = "12345678";

describe("account settings for mouse user", () => {
    before(() => {
        cy.createAccountMouse(USERNAME, EMAIL_DOMAIN, PASSWORD);
    });

    after(() => {
        cy.deleteAccountMouse(USERNAME, EMAIL_DOMAIN, PASSWORD);
    });

    beforeEach(() => {
        cy.navigateToSettingsMouse(USERNAME, EMAIL_DOMAIN, PASSWORD);
    });
});
