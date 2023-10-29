const {getTomorrowDay} = require("../../../cypress/support/util");
const {film, hall, hallForEqual, time, row, chair, expectedUrlAfterAttemptOfBooking
} = require("../../../cypress/fixtures/booking_data");
const {bookingPageUrl} = require("../../../cypress/fixtures/bookingPage.json");

const filmForEqual = film.slice(1, -1);
const timeForEqual = time.slice(1, -1);

describe("Тесты со стороны пользователя", () => {
    beforeEach(() => {
        cy.visit(bookingPageUrl);
    });
 
    it("Positive - Should book ticket (Film 3 - Супер залл - 10:00)  - tomorrow", () => {
    const day = getTomorrowDay();
    // выбираем день недели
     cy.chooseDay(day);
    // выбираем время для конкретного фильма
     cy.chooseTimeAndFilm(film, hall, time);
    // проверям, действительно ли мы выбираем место для конкретного фильма и конкретного сеанса
     cy.checkTicketDataBeforeBooking(filmForEqual, timeForEqual, hallForEqual);
    // выбираем и кликаем место
     cy.chooseAndClickChair(row, chair);
    // нажимаем забронировать
     cy.book();
     //page.waitForNavigation();
    // проверка перехода на страницу информации о забронированных билетах
     cy.wait(2000);
     cy.checkUrl(expectedUrlAfterAttemptOfBooking);
    // проверка информации о забронированном билете
     cy.checkTicketDataAfterBooking(filmForEqual, hallForEqual, timeForEqual);
    // показать код (это приводит к отправке данных на сервер, место будет отмечено, как забронированное)
     cy.showCode();
    // проверка, что код виден
     cy.codeIsVisible();
  });
});
