/**
 * Created by Kasper Richard Mølle on 21-06-2017.
 */
var mongoose = require('mongoose');
var connect = require('../config/dbconnect');

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
var Requests = mongoose.model('Request', requestSchema);  //***

module.exports = Requests;