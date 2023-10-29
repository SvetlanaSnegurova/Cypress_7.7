// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
require('cypress-xpath')

const admin = require("../fixtures/elementsForAdminPage.json");
const dataFotHallCreation = require("../fixtures/dataForHallCreation.json");
const {startPageForAdmin, login, password} = require("../fixtures/login_data.json");

after(() => {
  cy.visit(startPageForAdmin);
  cy.login(login, password);
  cy.wait(4000);
  dataFotHallCreation.forEach(data => {
      if (data.hallName == "Супер зал") {
        cy.get(admin.filmToRemove).click();
        cy.wait(5000);
        cy.get(admin.deleteHallButton).click();
        cy.wait(5000);
      }
      if (data.hallName == "Уютный зал") {
       cy.get(admin.filmToRemove).click();
       cy.wait(5000);
       cy.get(admin.deleteHallButton).click();
       cy.wait(5000);
     }
    });
   });

