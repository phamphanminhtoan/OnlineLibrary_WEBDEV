var Rent = require('../models/rent');

// Display list of all Rent.
exports.rent_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Rent list');
};

// Display detail page for a specific Rent.
exports.rent_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Rent detail: ' + req.params.id);
};

// Display Rent create form on GET.
exports.rent_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Rent create GET');
};

// Handle Rent create on POST.
exports.rent_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Rent create POST');
};

// Display Rent delete form on GET.
exports.rent_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Rent delete GET');
};

// Handle Rent delete on POST.
exports.rent_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Rent delete POST');
};

// Display Rent update form on GET.
exports.rent_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Rent update GET');
};

// Handle Rent update on POST.
exports.rent_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Rent update POST');
};