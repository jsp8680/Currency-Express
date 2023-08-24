//command to run: npx mocha register.test.js
const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("chai").assert;

describe("register", function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async function () {
        await driver.quit();
    });

    it("should fill out the register form and attempt login (correct info)", function (done) {
        this.timeout(10000);

        (async () => {
            await driver.get("https://currencyexpress.onrender.com/register");

            // Fill out the form with correct login credentials
            await driver.findElement(By.id("username")).sendKeys("test123");
            await driver.findElement(By.id("email")).sendKeys("test@example.com");
            await driver.findElement(By.id("password")).sendKeys("testpassword", Key.RETURN);

            await driver.wait(until.urlIs("https://currencyexpress.onrender.com/"), 10000);

            const currentUrl = await driver.getCurrentUrl();
            assert.equal(currentUrl, "https://currencyexpress.onrender.com/", "Login was not successful");

            done();
        })().catch(done);
    });

    it("should display an error message for incorrect email", function (done) {
        this.timeout(10000);

        (async () => {
            await driver.get("https://currencyexpress.onrender.com/register");

            // Fill out the form with incorrect login credentials
            await driver.findElement(By.id("username")).sendKeys("test123");
            await driver.findElement(By.id("email")).sendKeys("incorrect@example.com");
            await driver.findElement(By.id("password")).sendKeys("incorrectpassword", Key.RETURN);

            // Assuming the page displays an error message element, wait for it to appear
            await driver.wait(until.elementLocated(By.className("email error")), 10000);

            // Assert that the error message element is displayed
            const errorMessage = await driver.findElement(By.className("email error"));
            await driver.wait(until.elementIsVisible(errorMessage), 10000);
            assert.isTrue(await errorMessage.isDisplayed(), "Error message not displayed");

            done();
        })().catch(done);
    });  it("should display an error message for incorrect password", function (done) {
        this.timeout(10000);

        (async () => {
            await driver.get("https://currencyexpress.onrender.com/register");

            // Fill out the form with incorrect login credentials
            await driver.findElement(By.id("username")).sendKeys("test123");
            await driver.findElement(By.id("email")).sendKeys("test@example.com");
            await driver.findElement(By.id("password")).sendKeys("incorrectpassword", Key.RETURN);

            // Assuming the page displays an error message element, wait for it to appear
            await driver.wait(until.elementLocated(By.className("password error")), 5000);

            // Assert that the error message element is displayed
            const errorMessage = await driver.findElement(By.className("password error"));
            await driver.wait(until.elementIsVisible(errorMessage), 5000);
            assert.isTrue(await errorMessage.isDisplayed(), "Error message not displayed");

            done();
        })().catch(done);
    });
});
