
'use strict';

var promise = require('jquery-deferred');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var User = require('../models/userInfo.js');
var roomApi = require('./roomApi.js');


var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var	url = "mongodb://tony:tony123@ds049104.mongolab.com:49104/coconut";
var dbo
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db("");
});



function getUserInfo(data, deferred){

  dbo.collection('users').aggregate([
    {$match: {localUserName:'admin'}},
    {$unwind:"$recordModels"},
    {$lookup: {
        from: 'roomstatuses',
        localField: 'recordModels.roomID',
        foreignField: 'data._id',
        as: 'roomInfo'
        }},
    
    {$project:{
        "roomInfo":"$roomInfo",
        "localUserName" : 1,
        "recordModels":2
        }}
  ]).toArray(function(err, docs){
    console.log(docs)
    deferred.resolve(docs)
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
        roomID : data.motherRoomId,
        hourBit : data.hourBit,
        date: data.currentDate
      }
    }
  },
    function(err, result){
      if(err){
      console.log(err)
      }else{
        if(result){
          console.log("append to user db success")
          roomApi.updateRoomStatus(data.occupyId, data.totalBit)
          
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
    setNewUserRecord : function(data){
      var deferred = new promise.Deferred();
      setNewUserRecord(data, deferred);
      return deferred;
    }

};
