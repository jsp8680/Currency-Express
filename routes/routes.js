// Import necessary modules and controller
const { Router } = require('express');
const Controller = require('../controllers/controller');

// Create an instance of the Express Router
const router = Router();

// Define routes and associate them with controller actions

// Route for the about page
router.get('/about', Controller.about_get);

// Route for the converter page
router.get('/converter', Controller.converter_get);

// Route for the login page
router.get('/login', Controller.login_get);

// Export the router with defined routes
module.exports = router;