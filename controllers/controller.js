// Import necessary modules if required

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
