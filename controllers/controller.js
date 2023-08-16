// Import necessary modules if required
const User = require("../models/User");
const MongoClient = require("mongodb").MongoClient;
const jwt = require("jsonwebtoken");
// Controller action for handling GET request to the about page
module.exports.about_get = (req, res) => {
    // Render the "about.ejs" template when a user visits the about page
    res.render('about_us-contact_us.ejs');
}

// Controller action for handling GET request to the converter page
module.exports.converter_get = (req, res) => {
    // Render the "index.ejs" template when a user visits the converter page
    res.render('index.ejs');
}

module.exports.register_get = (req, res) => {
    // Render the "register.ejs" template when a user visits the register page
    res.render('register.ejs');
}

// Controller action for handling GET request to the login page
module.exports.login_get = (req, res) => {
    // Render the "login.ejs" template when a user visits the login page
    res.render('login.ejs');
}
module.exports.faqs_get = (req, res) => {
    // Render the "faqs.ejs" template when a user visits the faqs page
    res.render('faqs.ejs');
}

module.exports.profile_get = (req, res) => {
    // Render the "account.ejs" template when a user visits the profile page
    res.render('account.ejs');
}
module.exports.contact_post = async (req, res) => {
  const { name, email, message } = req.body;

  // Do something with the form data
  console.log("Received form data:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: maxAge,
  });
};
module.exports.register_post = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username,email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
       
        console.log(err);
    }
}


module.exports.logout_get = (req, res) => {
    // set cookie to nothing
    res.cookie("jwt", "", { maxAge: 1 });
    // redirect to home page
    res.redirect("/");
  };

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

  try {
    // login user
    const user = await User.login(email, password);
    // create a token
    const token = createToken(user._id);
    // set cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    // send response
    res.status(200).json({ user: user._id, email: user.email });
  } catch (err) {
    // const errors = handleErrorsForUsers(err);
    // res.status(400).json({ errors });
    console.log(err);
  }
}