const admin = require("../../fixtures/elementsForAdminPage.json");
const {login, password, startPageForAdmin} = require("../../fixtures/login_data.json");
const dataForHallCreation = require("../../fixtures/dataForHallCreation.json"); 

describe("Тесты со стороны администратора", () => {
    beforeEach(() => {
     cy.visit(startPageForAdmin);
      });

    it("Should add new hall and open sales", () => {
     cy.login(login, password);
     cy.wait(2000);
     // добавление двух залов с разными названиями
     dataForHallCreation.forEach(data => {
         cy.createHall(data.hallName);
     });
     // настройка конфигураций залов, связка их с фильмом и сеансом, а также открытие продаж каждого из залов
     dataForHallCreation.forEach(data => {
         cy.setHallConfigurations(data.hallName);
         cy.get(admin.saveStatus1).should("have.text", "Изменения сохранены");
         cy.setPrice(data.hallName);
         cy.get(admin.saveStatus2).should("have.text", "Изменения сохранены");
         cy.setSchedule(data.hallName);
         cy.addSession(data.timeOfSession);
         cy.openSales(data.hallName);
         cy.get(admin.salesStatus).should("have.text", "Продажа билетов открыта");
      });
     });    
});


