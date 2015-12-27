
'use strict';

var promise = require('jquery-deferred');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var User = require('../models/userInfo.js');
function setUserCompleteInfo(data,userID){
    var university = data.university;
    var uni_department = data.uni_department;
    //checking data whether right or not

    //success , storing into db
    console.log("data:"+university+"userID:"+userID);
    User.findOne({oauthID:userID}, function(err, user) {
        user.isRegCompletely = true;
        
        user.save(function(err) {
            if(err){
                console.log(err);
            }else{
                console.log("set sucess!!");
            }
        });
    });

}

module.exports = {
    setUserCompleteInfo: function(data,userID){
        setUserCompleteInfo(data,userID);
    }
};