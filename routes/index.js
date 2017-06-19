var express = require('express');
var router = express.Router();
var ioc = require( 'socket.io-client' );
// var passport = require('../config/passport');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var authConfig = require('../config/auth2')




passport.use(new GoogleStrategy(

    // Use the API access settings stored in ./config/auth.json. You must create
    // an OAuth 2 client ID and secret at: https://console.developers.google.com
    authConfig.google,

    function(accessToken, refreshToken, profile, done) {

        // Typically you would query the database to find the user record
        // associated with this Google profile, then pass that object to the `done`
        // callback.
        return done(null, profile);
    }
));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Kasper test page' });
});



router.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile', {
        user: req.user // get the user out of session and pass to template
    });
});

// route for logging out
    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get('/google/', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/oauth2callback',
    passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));



router.get('/websocket/', function(req, res, next) {
    res.render('websocket', { title: 'Kasper test page' });
});

router.get('/sendmessage', function(req, res, next) {

    var client = ioc.connect( "http://localhost:3000");
    client.on('connect', function () { console.log("socket connected"); });
    client.emit('toServer', { type: 'post', msg: 'whazzzup?' });
    res.send('message: sent');


    /*
    //' does not work in browsers
    var token = "Replace_this_with_your_JWT_token";
    var options = {
        headers: {
            "Authorization" : "JWT " + token
        }
    };

    */
});
    /*

// Tell the server this is client 1 (swap for client 2 of course)
    websocket.send(JSON.stringify({
        id: "client1"
    }));

// Tell the server we want to send something to the other client
    websocket.send(JSON.stringify({
        to: "client2",
        data: "foo"
    }));
     */

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



module.exports = router;
