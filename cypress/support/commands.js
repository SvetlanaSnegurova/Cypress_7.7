require('@4tw/cypress-drag-drop')
const user = require("../fixtures/elementsForUserPage.json");
const admin = require("../fixtures/elementsForAdminPage.json");
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

String.prototype.format = function () {
    // store arguments in an array
    var args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+)}/g, function (match, index) {
      // check if the argument is present
      return typeof args[index] == 'undefined' ? match : args[index];
    });
  };

// кастомные команды для администраторской сайта

Cypress.Commands.add('login', (login, password) => {
    cy.get(admin.loginInput).type(login);
    cy.get(admin.passwordInput).type(password);
    cy.get(admin.loginButton).click();
});

Cypress.Commands.add('createHall', (hallName) => {
    cy.contains('Создать зал').click();
    cy.wait(2000);
    cy.get(admin.hallNameInput).type(hallName);
    cy.contains('Добавить зал').click();
    cy.wait(5000); 
});

Cypress.Commands.add('setHallConfigurations', (hallName) => {
    cy.xpath(admin.hallInConfigurationSection.format(hallName)).click();
    cy.get(admin.hallConfigurations).contains("Сохранить").click();
    cy.wait(300);
});

Cypress.Commands.add('setPrice', (hallName) => {
    cy.xpath(admin.hallInPriceSection.format(hallName)).click();
    cy.get(admin.priceConfiguration).contains("Сохранить").click();
});

Cypress.Commands.add('setSchedule', (hallName) => {
    let sourсeElement = null;
    let targetElement = null;

    if (hallName == "Супер зал") {
        sourсeElement = '.conf-step__movies div:nth-child(3)';
        targetElement = '.conf-step__seances > div:nth-child(6) > div';
    };
    if (hallName == "Уютный зал") {
        sourсeElement = '.conf-step__movies div:nth-child(4)';
        targetElement = '.conf-step__seances > div:nth-child(7) > div';
    }
    // 1 вариант
    const dataTransfer = new DataTransfer();
    cy.get(sourсeElement).trigger('dragstart', {
        dataTransfer
    });
    cy.get(targetElement).trigger('drop', {
        dataTransfer
    });
    cy.get(sourсeElement).trigger('dragend');
    
    // 2 вариант
    /* cy.get(sourсeElement).drag(targetElement); */
  
    // 3 вариант
    /* cy.get(sourсeElement)
    .trigger('mousedown', { which: 1 })
    .trigger('mousemove', { clientX: 11400, clientY: 11100 })
    .trigger('mouseup', {force: true}) */
  
    // 4 вариант
    /* cy.get(sourсeElement).drag(targetElement, {
      source: { x: 100, y: 500 } // applies to the element being dragged
     }) */
    cy.wait(3000);
});

Cypress.Commands.add('addSession', (time) => {
    cy.get(admin.popupTitle).should("have.text", "Добавление сеанса");
    cy.get(admin.timeSessionInput).type(`${time}`);
    cy.get(admin.addSession).click();
    cy.wait(1000);
});

Cypress.Commands.add('openSales', (hallName) => {
    cy.xpath(admin.hallInStartSalesSection.format(hallName)).click();
    cy.contains('Открыть продажу билетов').click();
    cy.wait(500);
});

// кастомные команды для бронирования билетов

Cypress.Commands.add('chooseDay', (day) => {
    cy.xpath(user.dayElement.format(day)).click();
});

Cypress.Commands.add('chooseTimeAndFilm', (film, hall, time) => {
     // для того, чтобы кликнуть на 12:00 Фильма 3, а не какого-то другого фильма:
     // 1. мы находим прародителя, у которого есть "внук" Фильм 3
     // 2. затем у этого прародителя ищем элемент Супер залл
     // 3. затем у этого прародителя ищем элемент 12:00
     // Таким образом, находим 12:00 именно Супер залла и именно Фильма 3
     cy.xpath(user.filmSession.format(film, hall, time)).click();
});

Cypress.Commands.add('checkTicketDataBeforeBooking', (filmForEqual, timeForEqual, hallForEqual) => {
     // тот ли фильм?
     cy.wait(2000);
     cy.get(user.filmTitle).should("have.text", filmForEqual);
     // верное ли время?
     cy.get(user.filmTime).should("have.text", `Начало сеанса: ${timeForEqual}`);
     // верный ли зал? 
     cy.get(user.hallName).should("have.text", hallForEqual);
});

Cypress.Commands.add('chooseAndClickChair', (row, chair) => {
    // выбираем ряд
    // выбираем кресло, выбранного ранее ряда
    // кликаем на кресло
    cy.get(user.chairOfRow.format(row, chair)).click();
});

Cypress.Commands.add('book', () => {
    cy.contains("Забронировать").click();
});

Cypress.Commands.add('checkUrl', (expectedUrlAfterAttemptOfBooking) => {
    cy.wait(2000);
    cy.url().should("eq",`${expectedUrlAfterAttemptOfBooking}`);
});

Cypress.Commands.add('checkTicketDataAfterBooking', (filmForEqual, hallForEqual, timeForEqual) => {
    cy.get(user.filmTitleAfterBooking).should("have.text", filmForEqual);
    cy.get(user.hallNameAfterBooking).should("have.text", hallForEqual);
    cy.get(user.filmTimeAfterBooking).should("have.text", timeForEqual);
});

Cypress.Commands.add('showCode', () => {
    cy.wait(2000);
    cy.contains("Получить код бронирования").click();
});

Cypress.Commands.add('codeIsVisible', () => {
    cy.wait(2000);
    cy.get(user.qrCode);
});
