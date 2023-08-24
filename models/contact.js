const mongoose = require('mongoose');
const { isEmail } = require('validator');


const contactSchema = new mongoose.Schema({

    name: {
      type: String,
      required: [true, 'Full name is required'],
      minlength: [7, 'Full name must be at least 7 characters.'],
      maxlength: [25, 'Full name must be no longer than 25 charaters.'],
    },
    email: {
      // match: [/^[^ ]+@[^ ]+\.[a-z]{2,3}$/, 'Provide a vaild email address']
      type: String,
      required: [true, 'Please enter an email'],
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email']
      
    },
    message: {
      type: String, 
      required: [true, 'Message is required']
    }
  })
  
  
  const Contact = mongoose.model('contact', contactSchema);
  module.exports = Contact;