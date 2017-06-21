/**
 * Created by Kasper Richard Mølle on 21-06-2017.
 */
var mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1/learning', function (err) {
    if (err) {
        console.log('connection error ', err);
    } else {
        console.log('connection to MongoDB successful');
    }
});