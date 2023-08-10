// Import necessary modules if required

// Controller action for handling GET request to the about page
module.exports.about_get = (req, res) => {
    // Render the "about.ejs" template when a user visits the about page
    res.render('about.ejs');
}

// Controller action for handling GET request to the converter page
module.exports.converter_get = (req, res) => {
    // Render the "index.ejs" template when a user visits the converter page
    res.render('index.ejs');
}

// Controller action for handling GET request to the login page
module.exports.login_get = (req, res) => {
    // Render the "login.ejs" template when a user visits the login page
    res.render('login.ejs');
}
