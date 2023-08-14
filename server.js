// Import the required modules
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const { requireAuth, checkUser } = require('./middleware/middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Routes = require("./routes/routes");
// Serve static files from the "public" directory
app.use(express.static("public"));
// Parse URL-encoded bodies and JSON data in requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the view engine to use EJS templates
app.set("view engine", "ejs");

// Connect to the MongoDB database using Mongoose
const dbURI = 'mongodb+srv://discord8680:98ZeiAteNRS2tpLH@cluster0.e4ob5c0.mongodb.net/';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000),console.log('Server is running on port 3000 http://localhost:3000/'))
  .catch((err) => console.log(err));

// checks if the user is authenticated for every route.
app.get('*', checkUser);
// renders the "home" view when accessing the root URL.
app.get('/', (req, res) => res.render('home'));
// Use the routes defined in the imported Routes module
app.use(Routes);



// db password 98ZeiAteNRS2tpLH username discord8680
