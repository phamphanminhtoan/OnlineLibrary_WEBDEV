var Customer = require('../models/customer');

// Display list of all Customer.
exports.customer_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer list');
};

// Display detail page for a specific Customer.
exports.customer_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer detail: ' + req.params.id);
};

// Display Customer create form on GET.
exports.customer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer create GET');
};

// Handle Customer create on POST.
exports.customer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer create POST');
};

// Display Customer delete form on GET.
exports.customer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer delete GET');
};

// Handle Customer delete on POST.
exports.customer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer delete POST');
};

// Display Customer update form on GET.
exports.customer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer update GET');
};

// Handle Customer update on POST.
exports.customer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Customer update POST');
};