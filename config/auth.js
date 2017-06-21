/**
 * Created by Kasper Richard Mølle on 18-06-2017.
 */
// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '209263643074-djoa0evjto2nkhjbonh8reo16ipatlvo.apps.googleusercontent.com',
        'clientSecret'  : 'VISZWNjvyo20ZT-_xLAh5mM2',
        'callbackURL'   : 'http://nokeys.ddns.net//oauth2callback'
    }

};