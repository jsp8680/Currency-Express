const express = require('express');
const ejs = require('ejs');
const mongoose = require(mongoose);
const bodyParser = require("body-parser");

//Connect to the MongoDb Database
const url=`mongodb+srv://rjwright929:hello123@cluster0.dhfxvb8.mongodb.net/contactInfo`;


//Create an instance of the express application
const app = express();

app. use(bodyParser.urlencoded({extented: true}));

//Set connection params
const connectionParams={
  useNewUrlParser: true,
  useUnifiedTopology: true
};

//create a data schema
const contactSchema = new mongoose.Schema({

  name: {type: String, required: true},
  email: {type: String, required: true},
  message: {type: String, required: true}
})

module.exports = mongoose.model('Contact', contactSchema);

//GET method
app.get("/contact", function(req, res){
  res.sendFile(__dirname +"/about_us-contact_us.ejs");
})

//POST method
app.post("/contact",function(req, res){
  const contact = new contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
});

contact.save();
 return res.redirect("http://localhost:3000/");
 
})

app.post("/contact" ,function(req, res){
  return res.redirect("http://localhost:3000/");
})

//app.post
app.listen(3000, function(){
  console.log("server is running on 3000")
})
