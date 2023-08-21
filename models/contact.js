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
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      validate: [isEmail, 'Provide a vaild email address']
    },
    message: {
      type: String, 
      required: [true, 'Message is required']
    }
  })
  
  module.exports = mongoose.model('Contact', contactSchema);


  
