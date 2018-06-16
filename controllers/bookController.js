var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');

var async = require('async');

exports.index = function(req, res, next) {
    async.parallel({
        list_genres: function (callback) {
            Genre.find()
                .exec(callback);
        },
        book_list: function (callback) {
            Book.find()
                .exec(callback);
        },
    }, function (err, results) {
        // Successful, so render.
        res.render('index', { title: 'Online Library',list_genres: results.list_genres, book_list: results.book_list } );
    });
};

// Display list of all books.
exports.book_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Book list');
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {

    async.parallel({
        list_genres: function (callback) {
            Genre.find()
                .exec(callback);
        },

        // book: function (callback) {
        //     Book.findById(req.params.id)
        //         .exec(callback);
        // },

    }, function (err, results) {
        // Successful, so render.
        Book.findOne({_id: req.params.id}, function (err, result) {
            Author.findOne({_id: result.author}, function (err, results2) {
                Genre.findOne({_id: result.genre}, function (err, results3) {
                    res.render('book_detail', {title: 'Book Detail',list_genres: results.list_genres, book: result, author: results2, genre: results3});
                })
            });
        });
    });


};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('create_book', { title: 'Create Book',authors:results.authors, genres:results.genres });
    });
};

// Handle book create on POST.
exports.book_create_post = function( req, res){


    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author must not be empty.').notEmpty();
    req.checkBody('summary', 'Summary must not be empty.').isEmail();
    req.checkBody('genre', 'Genre must not be empty').notEmpty();

    var newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: 'blabla',
        image: ['http://sv1.upsieutoc.com/2018/05/09/wise_mans_fear_parts-1-and-2---simonetti.jpg',
            'http://sv1.upsieutoc.com/2018/05/09/wise_mans_fear_parts-1-and-2---simonettif9e85f18801cef00.jpg',
            'http://sv1.upsieutoc.com/2018/05/09/20140404-164514.jpg'],
        genre: req.body.genre,
    });
    Book.createBook(newBook, function (err, book) {
        if (err) throw err;
        console.log(book);
    });
    res.redirect(newBook.url);
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    //res.send('NOT IMPLEMENTED: Book delete GET');
    // Assume valid BookInstance id in field.
    Book.findByIdAndRemove(req.params.id, function deleteBook(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of BookInstance items.
        res.redirect('/catalog');
    });
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    //res.send('NOT IMPLEMENTED: Book delete POST');

    // Assume valid BookInstance id in field.
    Book.findByIdAndRemove(req.body.id, function deleteBook(err) {
        if (err) { return next(err); }
        // Success, so redirect to list of BookInstance items.
        res.redirect('/catalog');
    });
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});