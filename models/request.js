/**
 * Created by Kasper Richard Mølle on 21-06-2017.
 */
/**
 * Created by Kasper Richard Mølle on 13-06-2017.
 */
var mongoose = require('mongoose');

// var users = mongoose.connection;



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
var request = mongoose.model('request', requestSchema);  //***
module.exports = request;