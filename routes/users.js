var express = require('express');
var router = express.Router();
// bring in models
var Users = require('../models/user');
var Requests = require('../models/request');
var request = require('request');



/* GET users listing. */
router.get('/', function(req, res, next) {


  Users.find({}, function (err, users) {
      if(err){
        console.log(err);
      } else {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write('DATA ARE: '+ "<br/>");
          for(i in users){
              res.write('First Name: '+users[i].fname+"<br/>");
              res.write(' Last Name: '+ JSON.parse(JSON.stringify( users[i].lname)) +"<br/>" );
              res.write('Email: ' +users[i].email +"<br/>" );
              res.write('password: ' +users[i].pwr +"<br/>" );


          }
          res.end();
      }
  });

});

router.get('/test/', function(req, res, next) {


    res.render('test', { title: 'Kasper test page' });

});

router.post('/signUp', function(req, res, next) {
    var email = req.param('email');
    var psw = req.param('psw');
    var pswRepeat = req.param('psw-repeat');

    res.write(email+psw+pswRepeat);
    res.end();
    /*
     var User = new student({name:"bob", snum:1234})
     student.find(function (err, d) {
     if (err) return next(err);
     if (d.length==0) s.save();
     });
     */
});

router.post('/login', function(req, res, next) {

    var email = req.param('email');
    var password = req.param('password');


    Users.find({email: email}, function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            if (password.toString().trim() === users[0].pwd)
            {
                res.write('DATA ARE: ' + "<br/>");
                for (i in users) {
                    res.write('First Name: ' + users[i].fname);
                    res.write(' Last Name: ' + users[i].lname + "<br/>");
                    res.write(' ID: ' + users[i].id + "<br/>");
                }

            } else {

                res.write('Password wrong ');
                res.write('Password typed is : '+password);
                res.write(' correct was: '+ users[0].pwd);
            }
            res.end();
        }
    });
});

router.get('/consent/', function(req, res, next) {

    request('http://nokeys.ddns.net/users/authorization?id=118357991778862174817&request=0', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });



    res.render('consent', { title: 'You have now given consent' });

});

router.get('/authorization/', function(req, res, next) {

    // var user = req.param('user');
    var request = req.params.request;
    var id = req.params.id;
    console.log(req.param('id'));
    console.log(req.param('request'));
    Requests.find({ id:req.param('id') }).remove().exec();
    var re = new Requests({ id: req.param('id'), name: "Angel Angelov", lock: "Home lock", approved:req.param('request')});
    re.save(function(err) {
        if (err) console.log(err);
        else console.log("Success!")
    })
    /*
    Requests.findOne({id:req.param('id')}, function(err, p) {
        if (!p)
            return next(new Error('Could not load Document'));
        else {
            // do your updates here
            p.approved = request;

            var re = new Requests({ id: req.param('id'), name: "Angel Angelov", lock: "Home lock", approved:1});
            re.save(function(err) {
                if (err) console.log(err);
                else console.log("Success!")
            })


        }
    });
    */
    // res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Request received');
    res.write('The request was: '+req.param('request'))
    res.end();

});



module.exports = router;
