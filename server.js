// Import the required modules
const express = require("express");
const app = express();
const port = 3000;

// Import your custom routes module
const Routes = require("./routes/routes");

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
app.listen(port, () => console.log(`Listening on port ${port}!`));
