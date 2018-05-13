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
    // var authorId;
    // async.parallel({
    //     book: function (callback) {
    //         Book.findById(req.params.id)
    //             .exec(callback);
    //         authorId = book.author
    //     },
    //     book_author: function (callback) {
    //         Book.findOne({'_id': req.params.id}, function (callback) {
    //             Author.findOne({})
    //         })
    //     }
    //
    // }, function (err, results) {
    //     if (err) { return next(err); } // Error in API usage.
    //     if (results.book == null) { // No results.
    //         var err = new Error('Book not found');
    //         err.status = 404;
    //         return next(err);
    //     }
    //     //Successful , so render
    //     res.render('book_detail', { title: 'Book Detail', book:  results.book, book_author: results.book_author});
    // });
    // Book.findById(req.params.id)
    //     .populate('book')
    //     .exec(function (err, book) {
    //         if (err) { return next(err); }
    //         if (book==null) { // No results.
    //             var err = new Error('Book copy not found');
    //             err.status = 404;
    //             return next(err);
    //         }
    //         // Successful, so render.
    //         res.render('book_detail', { title: 'Book Detail', book:  book});
    //     })

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
                res.render('book_detail', {title: 'Book Detail',list_genres: results.list_genres, book: result, author: results2});
            });
        });
    });


};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};