var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Handlebars = require('handlebars');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');


var objectId = require('mongodb').ObjectID;

var User = require('../models/user');
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');

var async = require('async');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('signin', {layout: 'login_layout'});
});

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

router.get('/admin/dashboard', ensureAuthenticated, function(req, res, next) {
    async.parallel({
        list_users: function (callback) {
            User.find()
                .exec(callback);
        },
        book_list: function (callback) {
            Book.find().populate('genre author')
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('dashboard', {layout:'dashboard_layout', title: 'Book List', book_list:  results.book_list, list_users: results.list_users});
    });
});

router.get('/admin/register',ensureAuthenticated, function(req, res, next) {
    res.render('admin_register', {layout: 'admin_register_layout'});
});

router.post('/admin/register', function (req, res) {
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
        res.render('admin_register', {
            layout: 'admin_register_layout',
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
                    res.render('admin_register', {
                        layout: 'admin_register_layout',
                        user: user,
                        mail: mail
                    });
                }
                else {
                    var newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password,
                        authorize: true
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
                        password: password,
                        authorize: false
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



router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }), function (req, res) {
    res.redirect('/');
});


router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

router.get('/info/:id',ensureAuthenticated, function (req, res) {
    res.render('info',{title: 'Your Profile'});
});

router.get('/info/:id/edit_profile', ensureAuthenticated, function (req, res) {
    res.render('edit_profile',{title: 'Your Profile'});
});

router.post('/info/:id', ensureAuthenticated, function (req, res) {
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

router.get('/info/:id/reset_password', ensureAuthenticated, function (req, res) {
    res.render('reset_password', {title: 'Reset Password'});
});


router.post('/info/:id/reset_password', ensureAuthenticated, function (req, res) {
    req.checkBody('new_password', 'Password is required').notEmpty();
    req.checkBody('new_password2', 'Passwords do not match').equals(req.body.new_password);

    var user = new User({
        password: req.body.new_password,
        _id: req.params.id,
    });
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            var id = req.params.id;
            User.updateOne({"_id": objectId(id)}, {$set: user}, function (err, reuslt) {
                console.log('Updated');
            });
        });
    });
    res.redirect('/users/info/'+req.params.id);
});

router.get('/forgot', function (req, res) {
    res.render('forgot_password', {layout: 'login_layout'});
});

router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'learntocodeinfo@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'learntocodeinfo@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/users/forgot');
    });
});

router.post('/admin/dashboard/:id/update_authorize', function (req, res, next){
    // User.findOne({_id: req.params.id}, function (err, user) {
    //     if (err) return next(err);
    //     if(user.authorize && req.body.authorizeUser == false){
    //         user.authorize = false;
    //         var id = req.params.id;
    //         User.updateOne({"_id": objectId(id)}, {$set: user}, function (err, reuslt) {
    //             console.log('Updated');
    //         });
    //     }
    //     if(user.authorize == false && req.body.authorize === 'Admin'){
    //         user.authorize = true;
    //         var id = req.params.id;
    //         User.updateOne({"_id": objectId(id)}, {$set: user}, function (err, reuslt) {
    //             console.log('Updated');
    //         });
    //     }
    //     res.redirect('/users/admin/dashboard');
    // });

    var user = new User({
        authorize: req.body.authorizeUser,
        _id: req.params.id,
    });
    var te = req.body.authorizeUser;
    var id = req.params.id;
    User.updateOne({"_id": objectId(id)}, {$set: user}, function (err, reuslt) {
        console.log('Updated');
    });
    res.redirect('/users/admin/dashboard');
});

router.post('/admin/dashboard/update_authorize', function (req, res, next) {

});

module.exports = router;
