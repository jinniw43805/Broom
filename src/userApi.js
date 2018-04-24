
'use strict';

var promise = require('jquery-deferred');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var User = require('../models/userInfo.js');
var roomApi = require('./roomApi.js');
function setUserCompleteInfo(data, userID, deferred){
    var res = {};
    var university = data.university;
    var uni_department = data.uni_department;
    //checking data whether right or not

    //success , storing into db
    console.log("data:"+university+"userID:"+userID);
    console.log("catch userID: "+ userID)
    User.findOne({ localUserName: userID}, function(err, user) {
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
function addNewCourse(userID,courseName,courseID,deferred){
    var res={};
    User.findOne({oauthID:userID}, function(err, user) {
        console.log("try to storing new course to:"+userID);
        console.log("courseName:"+courseName+"courseID"+courseID);
        var CourseData = {
            courseName: courseName,
            courseID: courseID
        }
        user.ownCourses.push(CourseData);
        user.joinCourses.push(CourseData);
        user.save(function(err) {
            if(err){
                console.log(err);
            }else{
                console.log("set sucess!!");
                res = {
                    type : "result",
                    data : "S01"
                }
            }
            deferred.resolve(res);
        });
    });

}

function getUserInfo(data, deferred){
  User.find({'localUserName' : data.userName}
  , function(err, result){
    if(err){
      console.log(err)
    }else{
      if(result){
        deferred.resolve(result)
      }
    }
  })
}
function setNewUserRecord(data, deferred){
  //console.log(JSON.stringify(data))
  //console.log(data)
  //data = JSON.stringify(data)
  //data = data.substring(0, data.length - 1); // "12345.0"
  //data = data.substring(1, data.length); // "12345.0"
  
  //console.log(data)
  //data = JSON.parse(data);
  console.log(data)
console.log(data.username)
  console.log(data.roomId)
  console.log(data.hourBit)
  User.findOneAndUpdate({localUserName : data.username},{
    $push : {
      recordModels : {
        roomID : data.roomId,
        hourBit : data.hourBit
      }
    }
  },
    function(err, result){
      if(err){
      console.log(err)
      }else{
        if(result){
          console.log("append to user db success")
          roomApi.updateRoomStatus(data.roomId, data.totalBit)
          
          deferred.resolve(result);
        }
      }
    })
}
module.exports = {
    getUserInfo : function(data){
      var deferred = new promise.Deferred();
      getUserInfo(data, deferred);
      return deferred;
    },
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
    addNewCourse : function(userID,courseName,courseID,deferred){
        // var deferred = new promise.Deferred();
        addNewCourse(userID,courseName,courseID,deferred);
        // return deferred;
    },
    setNewUserRecord : function(data){
      var deferred = new promise.Deferred();
      setNewUserRecord(data, deferred);
      return deferred;
    }

};
