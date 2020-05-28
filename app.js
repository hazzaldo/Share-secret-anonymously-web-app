require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(flash());
//tell the express app to use the session package with the configuration passed as JS object
app.use(session({
    secret: 'ERsds578"£$"£%£$^$%&&*',
    resave: false,
    saveUninitialized: false
}));

// use and initialise passport package
app.use(passport.initialize());
//use passport to setup a session
app.use(passport.session()); 

//connect to DB
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, 
(err) => {
    if (err) {
        throw new Error(err);
    } else {
        console.log(`Server connected successfully to MongoDB`);
    }
});
mongoose.set('useCreateIndex', true);

// Configure passport-local to use 'user' model for authentication
const User = require('./models/user');

// This will be a Local Strategy with the help of 'passport-local-mongoose'. We don't have to write a lot of code to define authentication and registration functionality. All heavy lifting is done by passport-local-mongoose.
passport.use(User.createStrategy());

//Serialize will insert a serialized form of the User id, into the session cookie. Deserialize will access the User id from the cookie in its original string format. Allowing us to identify who the user is and their identification, so that we can authenticate them on our server.
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

// Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secret',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
    });
  }
));

// Register routes which will be handled by Router (express mini app).
app.use('/', require('./routes'));

let port = process.env.PORT || 3000
app.listen(port, err => {
    if (err) {
        return console.log('ERROR', err);
    }
    console.log(`Server started on port ${port}`);
});
