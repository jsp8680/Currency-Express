const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: [true, 'Please enter an username'],
    unique: true,
    },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  targetCurrency: {
    type: String,
    required: [true, 'Please enter a target currency'],
    default: 'CAD',
  },
  sourceCurrency: {
    type: String,
    required: [true, 'Please enter a source currency'],
    default: 'USD',
  },
  decimalPlaces: {
    type: Number,
    required: [true, 'Please enter a number of decimal places'],
    default: 2,
  },
  favoriteCurrencies: [{
    code: String,
    name: String
}],
  profilePhoto: {
    type: String,
    default: 'https://www.w3schools.com/howto/img_avatar.png'
  }
});

// Create a virtual property to combine favorites with the rest of the currencies
userSchema.virtual('currenciesWithFavorites').get(function() {
  const allCurrencies = [
    { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'USD', name: 'United States Dollar' },
  { code: 'EUR', name: 'European Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'HKD', name: 'Hong Kong Dollar' }
  ];

  const favorites = this.favoriteCurrencies || [];

  // Combines favorite currencies with all currencies, ensuring no duplicates
  const uniqueCurrencies = allCurrencies.concat(favorites.filter(fav => !allCurrencies.some(curr => curr.code === fav.code)));

  return uniqueCurrencies;
});

// Sort the combined currency options with favorites at the top
userSchema.virtual('sortedCurrencies').get(function() {
  return this.currenciesWithFavorites.sort((a, b) => {
    const isAFavorite = this.favoriteCurrencies.some(fav => fav.code === a.code);
    const isBFavorite = this.favoriteCurrencies.some(fav => fav.code === b.code);

    if (isAFavorite && !isBFavorite) {
      return -1; // A is a favorite, so it comes before B
    } else if (!isAFavorite && isBFavorite) {
      return 1; // B is a favorite, so it comes before A
    }

    return a.name.localeCompare(b.name); // Sort alphabetically if neither is a favorite
  });
});

// Attach the virtuals to the JSON representation
userSchema.set('toJSON', { virtuals: true });



// fire a function before document is saved to database
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;