
'use strict';

var promise = require('jquery-deferred');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var User = require('../models/courseInfo.js');

function setNewCourse(data,deferred){
    var res={};
    console.log(data);
    deferred.resolve(res);
}


module.exports = {
    setNewCourse: function(data){
        var deferred = new promise.Deferred();
        setNewCourse(data,deferred);
        return deferred;

    }
}