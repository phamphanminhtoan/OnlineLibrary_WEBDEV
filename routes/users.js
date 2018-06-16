var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var objectId = require('mongodb').ObjectID;

var User = require('../models/user');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('signin', {layout: 'login_layout'});
});

router.get('/register', function(req, res, next) {
    res.render('register', {layout: 'register_layout'});
});

router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        //checking for email and username are already taken
        User.findOne({ username: {
                "$regex": "^" + username + "\\b", "$options": "i"
            }}, function (err, user) {
            User.findOne({ email: {
                    "$regex": "^" + email + "\\b", "$options": "i"
                }}, function (err, mail) {
                if (user || mail) {
                    res.render('register', {
                        user: user,
                        mail: mail
                    });
                }
                else {
                    var newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password
                    });
                    User.createUser(newUser, function (err, user) {
                        if (err) throw err;
                        console.log(user);
                    });
                    req.flash('success_msg', 'You are registered and can now login');
                    res.redirect('/users/login');
                }
            });
        });
    }
});



router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function (req, res) {
        res.redirect('/');
    });


router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

router.get('/info/:id', function (req, res) {
    res.render('info',{title: 'Your Profile'});
});

router.get('/info/:id/edit_profile', function (req, res) {
    res.render('edit_profile',{title: 'Your Profile'});
});

router.post('/info/:id', function (req, res) {
    req.checkBody('newname', 'Name is required').notEmpty();

    var user = new User({
       name: req.body.newname,
        email: req.body.newemail,
        _id: req.params.id,
    });
    var id = req.params.id;
    User.updateOne({"_id": objectId(id)}, {$set: user}, function (err, reuslt) {

        console.log('Updated');
    });

    res.redirect('/users/info/'+req.params.id);
});

router.get('/info/reset_password', function (req, res) {
    res.render('reset_password', {title: 'Reset Password'});
});

module.exports = router;
