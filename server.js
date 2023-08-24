// Import the required modules
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const { requireAuth, checkUser } = require('./middleware/middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Routes = require("./routes/routes");
const multer = require('multer');
const path = require('path');
const User = require("./model/User");
const Contact = require("./model/Contact");
const fs = require('fs');
require('dotenv').config();
const port = process.env.PORT;
process.env.NODE_VERSION = '20.5.1';
console.log(`Node.js version: ${process.env.NODE_VERSION}`);

// Serve static files from the "public" directory
app.use(express.static("public"));
// Parse URL-encoded bodies and JSON data in requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the view engine to use EJS templates
app.set("view engine", "ejs");

// Access environment variables
const username = process.env.usernam;
const password = process.env.password;

// Use the variables as needed
console.log('Username:', username);
console.log('Password:', password);

const encodedUsername = encodeURIComponent(username);
const encodedPassword = encodeURIComponent(password);
// // Connect to the MongoDB database using Mongoose
const dbURI = `mongodb+srv://${encodedUsername}:${encodedPassword}@cluster0.e4ob5c0.mongodb.net/`;
// // const dbURI = 'mongodb+srv://rjwright929:hello123@cluster0.dhfxvb8.mongodb.net/contact';
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((result) => app.listen(3000),console.log('Server is running on port 3000 http://localhost:3000/'))
//   .catch((err) => console.log(err));
//Set connection params
const connectionParams={
  useNewUrlParser: true,
  useUnifiedTopology: true
};


//Connect
mongoose.connect(dbURI,connectionParams)
.then( () => {
  console.log('Connected to the database');
})
.catch((err) => {
console.error(`Error connecting to the database. ${err}`);
}
);
// checks if the user is authenticated for every route.
app.get('*', checkUser);
// renders the "home" view when accessing the root URL.
app.get('/', (req, res) => res.render('home'));

// Configure multer storage
const storage = multer.diskStorage({
  destination: 'public/profile-photos', // Change this to your desired upload folder
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${fileExtension}`);
  }
});

const upload = multer({ storage });




// Route to handle profile photo upload
app.post('/uploadProfilePhoto', upload.single('photo'), async (req, res) => {
  try {
    const userID = req.body.userID; // Access the userID from req.body
    const photoUrl = `/profile-photos/${req.file.filename}`; // Construct the URL to the uploaded photo

    // Get the user's previous profile photo URL from the database
    const user = await User.findById(userID);
    const existingPhotoURL = user.profilePhoto;

    // Update the user's profile photo URL in the database
    await User.findByIdAndUpdate(userID, { profilePhoto: photoUrl });
    console.log('Photo uploaded successfully');

    // Delete the previous profile photo if it exists
    if (existingPhotoURL) {
      const fileName = existingPhotoURL.split('/').pop();
      deleteFile(fileName);
    }

    res.json({ success: true, photoUrl });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

// Function to delete a file
function deleteFile(fileName) {
  const filePath = `public/profile-photos/${fileName}`;

  fs.unlink(filePath, (error) => {
    if (error) {
      console.error(`Error deleting file ${fileName}:`, error);
    } else {
      console.log(`File ${fileName} deleted successfully.`);
    }
  });
}


// Use the routes defined in the imported Routes module
app.use(Routes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));

// db password 98ZeiAteNRS2tpLH username discord8680