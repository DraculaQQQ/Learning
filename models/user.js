/**
 * Created by Kasper Richard Mølle on 13-06-2017.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learning', function (err) {
    if (err) {
        console.log('connection error ', err);
    } else {
        console.log('connection to MongoDB successful');
    }

});
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
    pwd:{
        type: String,
        required: true
    }

});
var Users = mongoose.model('users', userSchema);  //***
module.exports = Users;