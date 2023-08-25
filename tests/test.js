//command to install selemuim: npm install --save selenium-webdriver
//command to install chrome webdriver: npm install chromedriver
//command to force install chrome webdriver: npm install chromedriver --chromedriver-force-download

const{By, Key, Builder} = require("selenium-webdriver");
require("chromedriver");

//Sign Up page test
async function test_case1(){
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
    await driver.findElement(By.name("password")).sendKeys("password", Key.RETURN);
    //await driver.findElement(By.name("register")).click("Register");
    
}

setInterval(function(){
    driver.quit();
 }, 10000);

test_case1();
  


//Login page test
async function test_case2(){
    //create driver
    let driver = await new Builder().forBrowser("chrome").build();

    //send driver to website
    await driver.get("https://currencyexpress.onrender.com");

    //grab an element from the page
    await driver.findElement(By.partialLinkText("Login")).click();

    //display the title
    console.log(await driver.getTitle());

    await driver.findElement(By.id("email")).sendKeys("bob123@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("password", Key.RETURN);
    //await driver.findElement(By.name("register")).click("Register");
    
    setInterval(function(){
        driver.quit();
     }, 10000);
}

test_case2();



//Contact page test
async function test_case3(){
    //create driver
    let driver = await new Builder().forBrowser("chrome").build();

    //send driver to website
    await driver.get("https://currencyexpress.onrender.com/about");

    //grab an element from the page
   // await driver.findElement(By.partialLinkText("Sign Up")).click();

    //display the title
    console.log(await driver.getTitle());


    await driver.findElement(By.name("name")).sendKeys("bob cook");
    await driver.findElement(By.name("email")).sendKeys("bob123@gmail.com");
    await driver.findElement(By.name("message")).sendKeys("This is my message");
    await driver.findElement(By.id("submit")).click();
    
}

setInterval(function(){
    driver.quit();
 }, 10000);


test_case3();
