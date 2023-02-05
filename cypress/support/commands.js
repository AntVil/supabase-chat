// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("createAccountMouse", (username, emailDomain, password) => {
    let email = `${username}@${emailDomain}`;

    cy.visit("/");

    cy.contains(":visible", "sign up", {matchCase: false}).click();

    cy.get("input:visible").first().type(email);
    cy.get("input:visible").eq(1).type(password);
    cy.get("input:visible").eq(2).type(password);

    cy.contains(":visible", "sign up", {matchCase: false}).click();

    // wait to ensure email was sent
    cy.wait(5000);

    // verify email
    cy.request(`https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${emailDomain}`).then(
        (emails) => {
            emails = emails.body;
            let lastEmailId = emails[emails.length-1].id
            cy.request(`https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${emailDomain}&id=${lastEmailId}`).then(
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

    cy.loginMouse(username, emailDomain, password);
    
    // using get and should to retry until element is visible
    cy.get("input[placeholder*='username']").should("be.visible").first().type(username);

    cy.contains(":visible", "create profile", {matchCase: false}).click();

    cy.contains(":visible", username, {matchCase: false});
});

Cypress.Commands.add("createAccountKeyboard", (username, emailDomain, password) => {
    let email = `${username}@${emailDomain}`;

    cy.visit("/");

    cy.get("body").tab().tab().tab().tab().type("{enter}");
    cy.contains("Create Account").should("be.visible");

    cy.get("body").tab().type(email);
    cy.get("body").tab().tab().type(password);
    cy.get("body").tab().tab().tab().type(password);
    cy.get("body").tab().tab().tab().tab().type("{enter}");

    // wait to ensure email was sent
    cy.wait(5000);

    // verify email
    cy.request(`https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${emailDomain}`).then(
        (emails) => {
            emails = emails.body;
            let lastEmailId = emails[emails.length-1].id
            cy.request(`https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${emailDomain}&id=${lastEmailId}`).then(
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

    cy.loginKeyboard(username, emailDomain, password);

    cy.get("body").tab().type(username);
    cy.get("body").tab().tab().type("{enter}");

    cy.contains(":visible", username, {matchCase: false});
});

Cypress.Commands.add("loginMouse", (username, emailDomain, password) => {
    let email = `${username}@${emailDomain}`;

    cy.visit("/");

    cy.get("input:visible").first().type(email);
    cy.get("input:visible").eq(1).type(password);
    cy.contains(":visible", "sign in", {matchCase: false}).click();
    
    // ensure login is finished
    cy.wait(2000);
});

Cypress.Commands.add("loginKeyboard", (username, emailDomain, password) => {
    let email = `${username}@${emailDomain}`;

    cy.visit("/");

    cy.get("body").tab().type(email);
    cy.get("body").tab().tab().type(password);
    cy.get("body").tab().tab().tab().type("{enter}");

    // ensure login is finished
    cy.wait(2000);
});

Cypress.Commands.add("navigateToSettingsMouse", (username, emailDomain, password) => {
    cy.loginMouse(username, emailDomain, password);

    cy.get("label[for='settingsScreen']").should("be.visible").click();
});

Cypress.Commands.add("navigateToSettingsKeyboard", (username, emailDomain, password) => {
    cy.loginKeyboard(username, emailDomain, password);

    cy.get("body").tab().type("{enter}");
});

Cypress.Commands.add("deleteAccountMouse", (username, emailDomain, password) => {
    cy.navigateToSettingsMouse(username, emailDomain, password);
    
    cy.contains(":visible", "delete").click();

    cy.get("[onclick]:visible").last().click();
});

Cypress.Commands.add("deleteAccountKeyboard", (username, emailDomain, password) => {
    cy.navigateToSettingsKeyboard(username, emailDomain, password);

    // elements with tabindex are reachable by keyboard users
    cy.contains(":visible", "delete").should("have.attr", "tabindex");
    cy.contains(":visible", "delete").click();

    cy.get("[onclick]:visible").last().should("have.attr", "tabindex");
    cy.get("[onclick]:visible").last().click();
});
