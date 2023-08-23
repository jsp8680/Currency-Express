// Import necessary modules if required
const User = require("../model/User");
const MongoClient = require("mongodb").MongoClient;
const jwt = require("jsonwebtoken");
const multer = require('multer');
// const Contact = require("./model/Contact");
const Contact = require("../model/Contact.js");

const fs = require('fs');
const path = require('path');
const deleteFile = require('../deleteFile');



const handleErrorsForUsers = (err) => {
  console.log(err.message, err.code);
  let errors = { username: "", email: "", password: "" };

  // incorrect firstname length (max)
  if (err.message === "Username must be less than 30 characters long") {
    errors.username = "Username must be less than 30 characters long";
  }

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "Invalid email";
  }

  // incorrect password
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    if (err.message.includes("username")) {
      errors.username = "That username is already in use";
    }
    if (err.message.includes("email")) {
      errors.email = "That email is already registered";
    }
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};


// Controller action for handling GET request to the about page
module.exports.about_get = (req, res) => {
    // Render the "about.ejs" template when a user visits the about page
    res.render('about_us-contact_us.ejs');
}

module.exports.changeInfo_get = (req, res) => {
  // Render the "about.ejs" template when a user visits the about page
  res.render('changeInfo.ejs');
}

// Controller action for handling GET request to the converter page
module.exports.converter_get = (req, res) => {
    // Render the "index.ejs" template when a user visits the converter page
    const user = res.locals.user;
    res.render('index.ejs', {user});
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
    const user = res.locals.user;
    // console.log(user)
    res.render('newAccount.ejs', {user});
}

const currencyNames = {
  USD: "United States Dollar",
  EUR: "Euro",
  JPY: "Japanese Yen",
  BRL: "Brazilian Real",
  MXN: "Mexican Peso",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  HKD: "Hong Kong Dollar",
  INR: "Indian Rupee",
  SGD: "Singapore Dollar"

  // Add more currency names as needed
};

module.exports.deleteAccount = async (req, res) => {
  const userID = req.body.userID;
  console.log(userID);
  try {
      // Fetch user data from the database and retrieve the image URL
      const user = await User.findById(userID);
      const imageUrl = user.profilePhoto;
      const imageName = path.basename(imageUrl);
console.log(imageName);
      deleteFile(imageName); // Delete the image from the server
      const user1 = await User.findByIdAndDelete(userID);
      res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ success: false, error: 'An error occurred' });
  }
};


module.exports.deleteCurrency = async (req, res) => {
  const currencyCodeToDelete = req.body.currencyCode;
  const userId = req.body.userID;
console.log(userId);
console.log(currencyCodeToDelete);
  try {
      const user = await User.findById(userId);
      // console.log(user);
      if (!user) {
          return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Find the index of the currency in the favoriteCurrencies array
      const currencyIndex = user.favoriteCurrencies.findIndex(curr => curr.code === currencyCodeToDelete);
      if (currencyIndex === -1) {
          return res.status(404).json({ success: false, error: 'Currency not found in favorites' });
      }

      // Remove the currency from the favoriteCurrencies array
      user.favoriteCurrencies.splice(currencyIndex, 1);
      await user.save();

      res.status(200).json({ success: true });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'An error occurred' });
  }
}

module.exports.addCurrency = async (req, res) => {
  
  const userID = req.body.userID;
  const currencyCode = req.body.currencyCode;
  const currencyName = currencyNames[currencyCode];

  try {
      // Check if the currency already exists in the user's favorites
      const user = await User.findOne({ _id: userID, 'favoriteCurrencies.code': currencyCode });

      if (user) {
          // Currency already exists in favorites, send an error response
          return res.json({ success: false, error: 'Currency is already a favorite' });
      }

      // Currency doesn't exist, add it to the user's favorites
      await User.findByIdAndUpdate(userID, { $push: { favoriteCurrencies: { code: currencyCode, name: currencyName } } });

      return res.json({ success: true });
  } catch (err) {
      return res.json({ success: false, error: 'An error occurred' });
  }
};

module.exports.getFavouriteCurrency = async (req, res) => {
  const user = res.locals.user;
  // console.log(user);
  const userID = user._id;
  try {
    const user = await User.findById(userID);
    if (!user) {
        return res.json({ success: false, error: 'User not found' });
    }
    console.log(user.favoriteCurrencies);
    return res.json({ success: true, favoriteCurrencies: user.favoriteCurrencies });
} catch (error) {
    console.error(error);
    return res.json({ success: false, error: 'An error occurred' });
}
}

module.exports.profile_post = async (req, res) => {
  const { userID, targetCurrency, sourceCurrency, decimalPlace } = req.body;
  // console.log('Received form data:', targetCurrency, sourceCurrency, decimalPlace);
//  const userID = user._id;
//  console.log(userID);
  console.log('Received form data:', req.body);
  try {
    // Find the user by their email
    const user = await User.findByIdAndUpdate(userID);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user's preferences
    user.targetCurrency = targetCurrency;
    user.sourceCurrency = sourceCurrency;
    user.decimalPlaces = decimalPlace;

    // Save the updated user document
    const updatedUser = await user.save();

    // console.log('User preferences saved to the database:', updatedUser);
    res.json({ success: true, message: 'User preferences saved successfully' });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    res.status(500).json({ success: false, message: 'Error saving user preferences' });
  }
}


module.exports.updateFavoriteCurrencies = async (req, res) => {
  const favoriteCurrencies = req.body.favoriteCurrencies;

  try {
      // Find the user by their email
      const user = await User.findOne({ email: req.user.email });

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Update the user's favorite currencies
      user.favoriteCurrencies = favoriteCurrencies;

      // Save the updated user document
      const updatedUser = await user.save();

      // console.log('User favorite currencies saved to the database:', updatedUser);
      res.json({ success: true, message: 'User favorite currencies saved successfully' });
  } catch (error) {
      console.error('Error saving user favorite currencies:', error);
      res.status(500).json({ success: false, message: 'Error saving user favorite currencies' });
  }
};

module.exports.contact_post = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = await Contact.create({ name, email, message });
   
  // Do something with the form data
  console.log("Received form data:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);
  console.log(contact);
  res.redirect("/");
}
catch (err) {
  console.log(err);
}
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: maxAge,
  });
};
module.exports.register_post = async (req, res) => {
    const { username, email, password } = req.body;
    if (username.length > 30) {
      const errors = handleErrorsForUsers({
        message: "Username must be less than 30 characters long",
      });
      res.status(400).json({ errors });
      return;
    }
    try {
        const user = await User.create({ username,email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
      const errors = handleErrorsForUsers(err);
      res.status(400).json({ errors });
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
    const errors = handleErrorsForUsers(err);
    res.status(400).json({ errors });
    console.log(err);
  }
};

