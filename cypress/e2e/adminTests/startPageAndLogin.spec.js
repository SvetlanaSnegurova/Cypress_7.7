const {startPageForAdmin, login, password} = require("../../../cypress/fixtures/login_data.json");
const admin = require("../../../cypress/fixtures/elementsForAdminPage.json");

describe("Проверка основной страницы и логин", () => {
   beforeEach(()=> {
    cy.visit(startPageForAdmin);
     });

   it("Should check elements of start admin page", () => {
    cy.get(admin.pageHeaderTitle).should("have.text", "Идёмвкино");
    cy.get(admin.pageHeaderSubtitle).should("have.text", "Администраторская");
    cy.get(admin.loginButtonTitle).should("have.text", "Авторизация");
     });

   it("Should login", () => {
    cy.login(login, password);
    cy.contains('Управление залами');
    cy.contains('Конфигурация залов');
     }); 
});


