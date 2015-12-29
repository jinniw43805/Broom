
'use strict';

var promise = require('jquery-deferred');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var User = require('../models/userInfo.js');
function setUserCompleteInfo(data,userID,deferred){
    var res = {};
    var university = data.university;
    var uni_department = data.uni_department;
    //checking data whether right or not

    //success , storing into db
    console.log("data:"+university+"userID:"+userID);
    User.findOne({oauthID:userID}, function(err, user) {
        user.isRegCompletely = true;
        user.university = university;
        user.uni_department = uni_department;
        user.save(function(err) {
            if(err){
                console.log(err);
            }else{
                console.log("set sucess!!");
            }
            deferred.resolve(res);

        });
    });

}

function getIsRegCompletely(userID,deferred){

}

function setIsRegCompletely(boolean,userID,deferred){

}
function addNewCourse(userID,courseID,deferred){
    var res={};
    User.findOne({oauthID:userID}, function(err, user) {
        user.ownCourses.push(courseID);
        user.joinCourses.push(courseID);
        user.save(function(err) {
            if(err){
                console.log(err);
            }else{
                console.log("set sucess!!");
            }
            deferred.resolve(res);
        });
    });

}
module.exports = {
    setUserCompleteInfo: function(data,userID){
        var deferred = new promise.Deferred();
        setUserCompleteInfo(data,userID,deferred);
        return deferred;
    },
    getIsRegCompletely: function(userID){
        var deferred = new promise.Deferred();

        return deferred;
    },
    setIsRegCompletely: function(boolean,userID){
        var deferred = new promise.Deferred();

        return deferred;
    },
    addNewCourse : function(userID,courseID,deferred){
        var deferred = new promise.Deferred();
        addNewCourse(userID,courseID,deferred);
        return deferred;
    }   

};