var express = require('express');
var router = express.Router();
var ioc = require('socket.io-client');
// var passport = require('../config/passport');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var authConfig = require('../config/auth2')
var Users = require('../models/user');
var Session = require('express-session');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
const ClientId = "209263643074-djoa0evjto2nkhjbonh8reo16ipatlvo.apps.googleusercontent.com";
const ClientSecret = "VISZWNjvyo20ZT-_xLAh5mM2";
const RedirectionUrl = "http://nokeys.ddns.net/oauth2callback";
var jwt = require('jsonwebtoken');
var request = require("request")
var Requests = require('../models/request');

var urlUsserInfo = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=';


router.use(Session({
    secret: 'your-random-secret-19890913007',
    resave: true,
    saveUninitialized: true
}));


passport.use(new GoogleStrategy(
    // Use the API access settings stored in ./config/auth.json. You must create
    // an OAuth 2 client ID and secret at: https://console.developers.google.com
    authConfig.google,

    function (accessToken, refreshToken, profile, done) {

        Users.findOne({email: profile._json.email}, function (err, usr) {
            usr.token = accessToken;
            console.log(accessToken);
            usr.save(function (err, usr, num) {
                if (err) {
                    console.log('error saving token');
                }
            });
            process.nextTick(function () {
                return done(null, profile);
            });
        });
        // Typically you would query the database to find the user record
        // associated with this Google profile, then pass that object to the `done`
        // callback.
        // return done(null, profile);
    }
));


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Kasper test page'});
});

router.get('/test', function (req, res, next) {
    Requests.findOne({approved: 0}, function (err, response) {
        if (!err) {
            if(response.id[0]="118357991778862174817"){
                console.log('match!')
            }else{
                console.log('fandt ikke noget');
            }

        }
    });

    Requests.find({}, function (err, users) {
        if(err){
            console.log(err);
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('DATA ARE: '+ "<br/>");
            for(userhub in users){
                res.write('Name: '+users[userhub].name+"<br/>");
                res.write(' id: '+users[userhub].id+"<br/>" );
                res.write('approved: ' +users[userhub].approved+"<br/>" );
                res.write('lock: ' +users[userhub].lock+"<br/>" );
                ;

            }
            res.end();
        }
    });

    /*
    authRequest.find({id: '118357991778862174817', approved: "0"}, function (err, request) {
        if (err) {
            console.log(err);
        } else {
            console.log(request[0].name);
            console.log('jeg render bare mit shiit');
            res.render('test', {title: 'Kasper test page'});
        }


    }); */
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
router.get('/google/', passport.authenticate('google', {scope: ['email', 'openid', 'https://www.googleapis.com/auth/userinfo.profile']}));


/*router.get('/oauth2callback',
 passport.authenticate('google', {
 successRedirect : '/profile',
 failureRedirect : '/profile'

 }));
 */

router.get('/oauth2callback/', function (req, res, next) {

    console.log(req.param('code'));
    var oauth2Client = getOAuthClient();
    var session = req.session;
    var code = req.query.code; // the query param code


    oauth2Client.getToken(code,

        function (err, tokens) {
            var token = tokens;
            for (var key = 'id_token' in tokens) {
                var id_token = tokens['id_token'];
                if (tokens.hasOwnProperty(key)) {
                    console.log(tokens['id_token']);

                    if (/content_[0-9]+_image/.test(key)) {
                        console.log('match!', tokens[key]);
                        // do stuff here!
                    }
                }
            }


            // Now tokens contains an access_token and an optional refresh_token. Save them.

            request({
                url: urlUsserInfo + token['access_token'],
                json: true
            }, function (error, response, body) {
                console.log(urlUsserInfo);
                var name = body['name'];
                var email = body['email'];
                var id = body['id'];
                var picture = body['picture'];
                var gender = body['gender'];
                var nationality = body['locale'];
                var verifiedEmail = body['verified_email'];


                if (!error && response.statusCode === 200) {
                    console.log(body) // Print the json response
                } else {
                    console.log('Something went wrong');
                }
                console.log(checkForRequests(id));
                Requests.findOne({approved: 0}, function (err, response) {
                    if (!err) {
                        if(!response){
                            console.log('fandt intet')
                        }else{
                            console.log('I do something else');
                        }

                    }
                });


                //if (checkForRequests(id) == false) {
                res.render('profile', {
                    id: id,
                    gender: gender,
                    nationality: nationality,
                    email: email,
                    name: name,
                    picture: picture,
                    vemail: verifiedEmail
                });

            });

            console.log(tokens);
            console.log(id_token);

            console.log(jwt.decode(id_token));
            sendMessage('the token is: ' + id_token);
            if (!err) {
                oauth2Client.setCredentials(tokens);
                //saving the token to current session
                session["tokens"] = tokens;

            }



        });
});

router.get('/websocket/', function (req, res, next) {
    res.render('websocket', {title: 'Kasper test page'});
});

router.get("/details", function (req, res) {
    var oauth2Client = getOAuthClient();
    oauth2Client.setCredentials(req.session["tokens"]);

    var p = new Promise(function (resolve, reject) {
        plus.people.get({userId: 'me', auth: oauth2Client}, function (err, response) {
            resolve(response || err);
        });
    }).then(function (data) {
        res.send(data.toString());
    })
});

router.get('/sendmessage', function (req, res, next) {
    var data = req.param('message');

    var client = ioc.connect("http://165.227.143.48");
    client.on('connect', function () {
        console.log("socket connected");
    });
    client.emit('toServer', {type: 'post', msg: data});
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
function getOAuthClient() {
    return new OAuth2(ClientId, ClientSecret, RedirectionUrl);
}

function getAuthUrl() {
    var oauth2Client = getOAuthClient();
    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
        'https://www.googleapis.com/auth/plus.me'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes // If you only need one scope you can pass it as string
    });

    return url;
}

function sendMessage(string) {
    this.data = string.toString();

    var client = ioc.connect("http://nokeys.ddns.net");
    client.on('connect', function () {
        console.log("socket connected");
    });
    client.emit('toServer', {type: 'post', msg: data});

}
function checkForRequests (id) {

    Requests.findOne({approved: 0}, function (err, response) {

        if (!err) {
            console.log('did not find an error');
            if(!response){
                console.log('Emty response - returns false')
                return false
            }
            if(response.id[0]=id){
                console.log('match! - returns false')
                return true;
            }

        }
    });
}

function getUserInfo (token){
    return token;
}



module.exports = router;
