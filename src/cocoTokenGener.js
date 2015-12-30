'use strict';
var randtoken = require('rand-token');

function getNewCourseId(){
    randtoken.generator({
        chars: '0-9'
    });

    var token = randtoken.generate(8,"123456789");
    return token;
}
function getNewNoteId(){
    
}
module.exports = {
    getNewCourseId: function(){
        return getNewCourseId();
    }
}