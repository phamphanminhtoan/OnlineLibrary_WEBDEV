var express = require('express');
var router = express.Router();

// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var customer_controller = require('../controllers/customerController');
var rent_controller = require('../controllers/rentController');
var user_controller = require('../controllers/userController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', book_controller.index);

//GET login page
router.get('/login', )

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);



// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
// router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

router.post('/book/:id', book_controller.post_comment);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

// /// CUSTOMER ROUTES ///
//
// // GET request for creating a Customer. NOTE This must come before route that displays Customer (uses id).
// router.get('/customer/create', customer_controller.customer_create_get());
//
// // POST request for creating Customer.
// router.post('/customer/create', customer_controller.customer_create_post());
//
// // GET request to delete Customer.
// router.get('/customer/:id/delete', customer_controller.customer_delete_get());
//
// // POST request to delete Customer.
// router.post('/customer/:id/delete', customer_controller.customer_delete_post());
//
// // GET request to update Customer.
// router.get('/customer/:id/update', customer_controller.customer_update_get());
//
// // POST request to update Customer.
// router.post('/customer/:id/update', customer_controller.customer_update_post());
//
// // GET request for one Customer.
// router.get('/customer/:id', customer_controller.customer_detail());
//
// // GET request for list of all Customer.
// router.get('/customer', customer_controller.customer_list());
//
// /// RENT ROUTES ///
//
// // GET request for creating a Rent. NOTE This must come before route that displays Rent (uses id).
// router.get('/rent/create', rent_controller.rent_create_get());
//
// // POST request for creating Rent.
// router.post('/rent/create', rent_controller.rent_create_post());
//
// // GET request to delete Rent.
// router.get('/rent/:id/delete', rent_controller.rent_delete_get());
//
// // POST request to delete Rent.
// router.post('/rent/:id/delete', rent_controller.rent_delete_post());
//
// // GET request to update Rent.
// router.get('/rent/:id/update', rent_controller.rent_update_get());
//
// // POST request to update Rent.
// router.post('/rent/:id/update', rent_controller.rent_update_post());
//
// // GET request for one Rent.
// router.get('/rent/:id', rent_controller.rent_detail());
//
// // GET request for list of all Rent.
// router.get('/rent', rent_controller.rent_list());

module.exports = router;