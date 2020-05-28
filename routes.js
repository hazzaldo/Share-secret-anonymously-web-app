const passport = require('passport');
const User = require('./models/user');
const router = require('express').Router();

let registerErrMsg = "";
let loginErrMsg = "";


router.get('/', (req, res) => {
    res.render('home');
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }
));


router.get('/auth/google/secret', 
    passport.authenticate('google', { 
        successRedirect: '/secret',
        failureRedirect: '/login'
}));


router.get('/login', (req, res) => {
    res.render('login', {
        loginErrMsg: req.flash('error')
    });
});


router.get('/register', (req, res) => {
    res.render('register', {
        registerErrMsg: registerErrMsg
    });
});


router.get('/secret', (req, res) => {
    User.find({'secret': {$ne: null}}, (err, foundUsers) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUsers) {
                res.render('secret', {
                    submittedSecrets: foundUsers
                });
            } else {
                console.log(`In GET '/secret' route. No users with secrets found.`);
            }
        }
    });
});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


router.get('/submit', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect('/login');
    }
});


router.post('/submit', (req, res) => {
    const submittedSecret = req.body.secret;
    User.findById(req.user.id, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(()=>{
                    res.redirect('/secret');
                });
            } else {
                console.log(`Error in POST '/submit' route. User with the following ID ${req.user.id} was not found.`);
            }
        }
    });
});

router.post('/register', (req, res, next) => {   
    //the register() method is available thanks to the 'passport-local-mongoose' package. We don't need to create a new User objet/document and then call the save() to save it to the MongoDB.
    User.register({username: req.body.username}, req.body.password, (err, registeredUser) => {
        if (err) {
            // console.log(JSON.stringify(err.name));
            switch (err.name) {
                case "UserExistsError":
                    registerErrMsg = `username '${req.body.username}' is already registered. Please try a different username.`;
                    break;
                case "MissingUsernameError":
                    registerErrMsg = `No username was given`;
                    break;
                case "MissingPasswordError":
                    registerErrMsg = `No password was given`;
                    break;
                default: 
                    registerErrMsg = `There was an error encountered. Please try to register again. Alternatively contact our support team.`;
                    console.log(`Error: ${err}.`);
            }
            res.redirect('/register');
        } else {
            console.log(`User ${registeredUser.username} registered successfully`);
            //If registration is successful we call 'next()' method, to move the execution to the 'passport.authenticate() middleware.
            next();
        }
    });
}, 
//If registration is successful then we need to authenticate user (using passport). Doing so we setup a cookie that saves the user's current logged-in session. We then use the Authenticate method, with success and failure redirects triggered if the authentication was successful or a failure respectively. And so we'll have to check to see if they're logged in or not, after registering to redirect them to 'secret' page. 
passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}));


router.post('/login', (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, (err) => {
        if (err) {
            loginErrMsg = `There was an error encountered. Please try to login again. Alternatively contact our support team.`;
            console.log(err);
            res.redirect('/login');
        } else {
            next();
        }
    });
},
passport.authenticate('local', { 
    failureRedirect: '/login',
    successRedirect: '/secret',
    failureFlash: { type: 'error', message: 'Invalid username or password.'}
})
);


module.exports = router;