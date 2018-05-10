var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RentSchema = new Schema(
    {
        book: [{type: Schema.ObjectId, ref: 'Book', required: true}],
        rent_date: {type: Date, required: true},
        due_date: {type: Date, required: true},
        fee: {type: String, required: true },
        customer: {type: Schema.ObjectId, ref: 'Customer', required: true},

    }
);

// Virtual for rent's URL
RentSchema
    .virtual('url')
    .get(function () {
        return '/catalog/rent/' + this._id;
    });

//Export model
module.exports = mongoose.model('Rent', RentSchema);