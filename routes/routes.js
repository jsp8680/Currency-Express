// Import necessary modules and controller
const { Router } = require('express');
const Controller = require('../controllers/controller');
const { requireAuth } = require('../middleware/middleware');

// Create an instance of the Express Router
const router = Router();

// Define routes and associate them with controller actions

// Route for the about page
router.get('/about', Controller.about_get);

// Route for the converter page
router.get('/converter', Controller.converter_get);

// Route for the login page
router.get('/login', Controller.login_get);
router.post('/login', Controller.login_post);

router.get('/profile', requireAuth, Controller.profile_get);
// Route for the faqs page
router.get('/faqs', Controller.faqs_get);

router.post('/contact', Controller.contact_post);
router.get('/register', Controller.register_get);
router.post('/register', Controller.register_post);

router.get('/logout',requireAuth, Controller.logout_get);
// Export the router with defined routes
module.exports = router;
