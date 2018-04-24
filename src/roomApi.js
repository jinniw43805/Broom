'use strict';
var promise = require('jquery-deferred');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var roomInfo = require('../models/roomInfo.js');
var roomStatus = require('../models/roomStatus.js');
var User = require('../models/userInfo.js');
var userApi = require('./userApi');
var tokenGener = require('./cocoTokenGener.js');
var async = require('async');
var asyncEachObject = require('async-each-object')

var forwardDays = 7;


function getAllRoomStatus(data, deferred){
  roomStatus.find({'data.occupys.date' : "2018-4-23"}
  , function(err, result){
    if(err){
      console.log(err)
    }else{
      if(result){
      
        deferred.resolve(result)
      }
    }
  })
  //roomStatus.find({'data.occupys.date' : "2018-4-23"}, function(err, result){
    //if(err){
      //console.log(err)
    //}else{
      //if(result){
      
        //deferred.resolve(result)
      //}
    //}
  //})
}
function setNewRoomStatus(roomID, provider){
  //Generate SubOccupy
  var occupys = [];
  var date = new Date();
  var subOccupys;
  for(var i=0; i < forwardDays; i++){
    //console.log(i)
    //occupys.push(i)
    subOccupys = {
      "timestamp" : (Date.now() + (86400 * i)),
      "date" : (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + i)),
      "oStatus" : "000000000000000"
    };
    occupys.push(subOccupys);
  }
  
  var storeRoomStatus = new roomStatus({
    provider : "UTD",
    data : {
      info : roomID,
      occupys : occupys
    }
  });

  storeRoomStatus.save(function(err){
    if(err){
      console.log(err)
    }else{
      console.log("insert new Provider")
      //setNewRoomStatus(roomID, provider)
    }
  })

 
  //roomStatus.findOne({provider : provider}, function(err, result) {
    //if(err) {
      //console.log(err)
    //}else{
      //console.log("room is in roomStatus")
      //if(result) {
        //roomStatus.findOneAndUpdate({
          //provider : provider
        //},
        //{
          //$push : {
              //data: {
                //info : roomID,
                //occupys : occupys
              //}
          //}
        //},function(err, result){
          //if(err){
            //console.log(err)
          //}else{
            //console.log("append success")
          //}
        //})
      //}
      //else{
        //console.log("room is not in roomStatus, append new object")
      //}
    //}
  //})

  //storeRoomStatus.save(function(err) {
    //if(err){
      //console.log(err);
    //}else{
      //console.log("update statuse ok");
    //}
  //})
  
}
function setNewRoomInfo(data, deferred){
    var res={};
    //console.log(data);

    var provider = data.provider;
    var rLocation = data.rLocation;
    var roomNumber = data.roomNumber;
    //:var capacity = data.capacity;
    //var equipment = data.equipment.whiteboard;
    //var computer = data.equipment.computer;
    //var projector = data.equipment.projector;
    //var disabilityFriendly = data.equipment.disabilityFriendly;
    //var podium = data.equipment.podium;

    console.log(provider+rLocation+roomNumber);
    roomInfo.findOneAndUpdate(
    {"provider" : provider},
    {
      $push : {roomInfo: {
        roomLocation : rLocation,
        roomNumber : roomNumber,
        //capacity : capacity,
        //equipment : {},
        //mapPath : mapPath
      }}
    },
    function(err, result){
      if(err){
        console.log(err);
      }else{
        setNewRoomStatus(result.id, provider);
        deferred.resolve(res);
      }
    })
    

}
//function getAllRoomInfo(provider, date, deferred){
  //var res = {
    //"provider" : provider,
    //"date" : date,
    
  //}
//}
//function updateAllRoomInfo(date, deferred){
  
//}
module.exports = {
    setNewRoomInfo: function(data){
        var deferred = new promise.Deferred();
        setNewRoomInfo(data,deferred);
        return deferred;

    },
    getAllRoomStatus : function(data){
      var deferred = new promise.Deferred();
      //date = "test";
      //provider = data.provider;
      getAllRoomStatus(data, deferred);
      return deferred;
    }
    //getAllRoomInfo: function(provider, date){
        //var deferred = new promise.Deferred();
        //getAllRoomInfo(provider, date, deferred);
        //return deferred;
    //}
}

