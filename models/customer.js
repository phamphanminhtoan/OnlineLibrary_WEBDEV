var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
    {
        name:{type: String, required: true},
        customer_id: {type: String, required: true},
    }
);

// Virtual for customer's URL
CustomerSchema
    .virtual('url')
    .get(function () {
        return '/catalog/customer/' + this._id;
    });

//Export model
module.exports = mongoose.model('Customer', CustomerSchema);