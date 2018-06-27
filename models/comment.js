var mongoose = require('mongoose');

// Comment Schema
var CommentSchema = mongoose.Schema({
    user: {
        type: Schema.ObjectId, ref: 'User', required: true
    },
    content:{
        type: String
    }
});

var Comment = module.exports = mongoose.model('Comment', CommentSchema);

module.exports.createComment = function(newComment, callback){
    newComment.save(callback);
}