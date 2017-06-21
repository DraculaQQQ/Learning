/**
 * Created by Kasper Richard Mølle on 13-06-2017.
 */
var mongoose = require('mongoose');
/*/mongoose.connect('mongodb://127.0.0.1/learning', function (err) {
    if (err) {
        console.log('connection error ', err);
    } else {
        console.log('connection to MongoDB successful');
    }

});

*/
// var users = mongoose.connection;



var userSchema = mongoose.Schema({
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    pwr:{
        type: String,
        required: true
    },
    id:{
        type: String,
        required: true
    }

});
var requestSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lock:{
        type: String,
        required: true
    },
    id:{
        type: String,
        required: true
    },
    approved:{
        type: Number,
        required: true
    }

});

var Users = mongoose.model('user', userSchema, 'Users');  //***
var request = mongoose.model('request', requestSchema, 'Users');

module.exports = Users;