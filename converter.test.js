const { Builder, By, Key, until } = require("selenium-webdriver");
require("chromedriver");
const assert = require("chai").assert;

describe("Currency Converter", function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async function () {
        await driver.quit();
    });

    it("should calculate the converted amount correctly", async function () {
        this.timeout(12000);
    
        await driver.get("https://currencyexpress.onrender.com/converter");
    
        try {
            console.log("Filling out the conversion form...");
            await driver.findElement(By.id("amount")).sendKeys("100");
         
            const amount = await driver.wait(until.elementLocated(By.id("amount")), 10000);
            const Amount = await amount.getAttribute("value");
            console.log("Amount entered", Amount);
            console.log("Selecting currencies...");
            const fromSelect = await driver.findElement(By.id("currencyFrom"));
            const toSelect = await driver.findElement(By.id("currencyTo"));
    
            await fromSelect.findElement(By.css('option[value="USD"]')).click();
            await toSelect.findElement(By.css('option[value="EUR"]')).click();
            const from = await fromSelect.getAttribute("value");
            const to = await toSelect.getAttribute("value");
            console.log("Currencies selected:", from, to);
            console.log("Clicking Convert button...");
            await driver.findElement(By.id("convertButton")).click();
    
            console.log("Waiting for conversion result...");
           const priorInput = await driver.findElement(By.id("prior"));
            const previousInput = await driver.wait(until.elementLocated(By.id("previous")), 10000);
const previous = await previousInput.getAttribute("value");
console.log("Previous amount:", previous);
            await driver.wait(until.elementIsVisible(priorInput), 10000);
    
            console.log("Fetching converted amount...");
            const convertedAmount = await priorInput.getAttribute("value");
    
            console.log("Converted amount:", convertedAmount);
    
            assert.equal(convertedAmount, "EUR 92.14", "Converted amount is incorrect");
        } catch (error) {
            console.error("An error occurred:", error.message);
            assert.fail(error.message);
        }
    });
});
