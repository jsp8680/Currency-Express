const express = require("express");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", (req, res) => res.render("home.ejs"));

app.get("/home", (req, res) => res.render("home.ejs"));
app.get('/login', (req, res) => res.render('login.ejs'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
