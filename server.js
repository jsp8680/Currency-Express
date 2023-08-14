// Import the required modules
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
// Import your custom routes module
const Routes = require("./routes/routes");
const dbURI = 'mongodb+srv://discord8680:98ZeiAteNRS2tpLH@cluster0.e4ob5c0.mongodb.net/';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000),console.log('Server is running on port 3000 http://localhost:3000/'))
  .catch((err) => console.log(err));
// Set the view engine to use EJS templates
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse URL-encoded bodies and JSON data in requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define a route for the root URL ("/") that renders the "home.ejs" template
app.get("/", (req, res) => res.render("home.ejs"));
// Use the routes defined in the imported Routes module
app.use(Routes);

// Start the server and listen on the specified port
// app.listen(port, () => console.log(`Listening on port ${port}!`));

// db password 98ZeiAteNRS2tpLH username discord8680
