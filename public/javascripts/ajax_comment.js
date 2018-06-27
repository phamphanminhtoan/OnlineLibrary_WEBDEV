$(document).ready(function(){
    $("button").click(function(){
        var x = $("form").serializeArray();
        $.each(x, function(i, field){
            $("#results").append(field.name + ":" + field.value + " ");
            saveComment(field.name, field.value);
        });

        document.getElementById('summary').value ="";


    });
});

var Comment = require('../models/comment');
var express = require('express');
var router = express.Router();
function saveComment(userID , Content, callback) {
    // var newComment = new Comment({
    //    user: userID   ,
    //     content: Content,
    // });
    // Comment.createComment(newComment,function (err, comment){
    //     if (err) throw err;
    //     console.log(comment);
    // });
    Comment.save({user: userID, content: Content});
}
