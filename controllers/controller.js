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
    const user = res.locals.user;
    // console.log(user)
    res.render('newAccount.ejs', {user});
}
const currencyNames = {
  USD: "US Dollar",
  EUR: "Euro",
  JPY: "Japanese Yen",
  // Add more currency names as needed
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
  
    const selectedCurrency = req.body.currencyCode;
    const userID  = req.body.userID;
    // console.log(selectedCurrency);
    const userId = userID; 
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const currencyName = currencyNames[selectedCurrency]; // Fetch from currencyNames object or data source

        user.favoriteCurrencies.push({ code: selectedCurrency, name: currencyName });
        await user.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
};

module.exports.getFavouriteCurrency = async (req, res) => {
  const user = res.locals.user;
  console.log(user);
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

    console.log('User preferences saved to the database:', updatedUser);
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

      console.log('User favorite currencies saved to the database:', updatedUser);
      res.json({ success: true, message: 'User favorite currencies saved successfully' });
  } catch (error) {
      console.error('Error saving user favorite currencies:', error);
      res.status(500).json({ success: false, message: 'Error saving user favorite currencies' });
  }
};

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