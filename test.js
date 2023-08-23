//command to install selemuim: npm install --save selenium-webdriver
//command to install chrome webdriver: npm install chromedriver
//command to force install chrome webdriver: npm install chromedriver --chromedriver-force-download

const{By, Key, Builder} = require("selenium-webdriver");
require("chromedriver");

async function test_case(){
    //create driver
    let driver = await new Builder().forBrowser("chrome").build();

    //send driver to website
    await driver.get("https://currencyexpress.onrender.com");

    //grab an element from the page
    await driver.findElement(By.partialLinkText("Sign Up")).click();

    //display the title
    console.log(await driver.getTitle());


    await driver.findElement(By.name("username")).sendKeys("bob123");
    await driver.findElement(By.name("email")).sendKeys("bob123@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("password");
    await driver.findElement(By.id("submit"))
    button.click();

    setInterval(function(){
        driver.quit();
     }, 10000);
}

test_case();
