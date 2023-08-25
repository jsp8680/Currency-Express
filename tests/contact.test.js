// command to run: npx mocha contact.test.js
const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("chai").assert;

describe("contact", function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async function () {
        await driver.quit();
    });

    it("should fill out the contact form an submit (correct info)", function (done) {
        this.timeout(10000);

        (async () => {
            await driver.get("https://currencyexpress.onrender.com/about");

            // Fill out the form with correct contact information
            await driver.findElement(By.id("name")).sendKeys("test name")
            await driver.findElement(By.id("email")).sendKeys("test149@gmail.com");
            await driver.findElement(By.id("message")).sendKeys("test message", Key.RETURN);
            await driver.findElement(By.id("submit")).click(Key.RETURN);
            
            await driver.wait(until.urlIs("https://currencyexpress.onrender.com/"), 10000);

            const currentUrl = await driver.getCurrentUrl();
            assert.equal(currentUrl, "https://currencyexpress.onrender.com/");

            done();
        })().catch(done);
    });

    it("should display an error message for an invalid email", function (done) {
        this.timeout(10000);

        (async () => {
            await driver.get("https://currencyexpress.onrender.com/about");

            // Fill out the form with incorrect contact information
            await driver.findElement(By.id("name")).sendKeys("test name");
            await driver.findElement(By.id("email")).sendKeys("incorrect example.com");
            await driver.findElement(By.id("message")).sendKeys("test message");
            await driver.findElement(By.id("submit")).click();
           

            // Assuming the page displays an error message element, wait for it to appear
            await driver.wait(until.elementLocated(By.id("note2")), 2000);

            // Assert that the error message element is displayed
            const errorMessage = await driver.findElement(By.id("note2"));
            await driver.wait(until.elementIsVisible(errorMessage), 10000);
            assert.isTrue(await errorMessage.isDisplayed(), "Error message not displayed");

            done();
        })().catch(done);
    });  
    
    it("should display an error message for too little or too much charaters for name", function (done) {
        this.timeout(2000);

        (async () => {
            await driver.get("https://currencyexpress.onrender.com/about");

            // Fill out the form with incorrect contact information
            await driver.findElement(By.id("name")).sendKeys("test");
            await driver.findElement(By.id("email")).sendKeys("test123@gmail.com");
            await driver.findElement(By.id("message")).sendKeys("test message");
            await driver.findElement(By.id("submit")).click();
           

            // Assuming the page displays an error message element, wait for it to appear
            await driver.wait(until.elementLocated(By.id("note1")), 2000);

            // Assert that the error message element is displayed
            const errorMessage = await driver.findElement(By.id("note1"));
            await driver.wait(until.elementIsVisible(errorMessage), 5000);
            assert.isTrue(await errorMessage.isDisplayed(), "Error message not displayed");

            done();
        })().catch(done);
    });

});

