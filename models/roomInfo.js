var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var db = require('../config/db.js');
var mongodbUri = db.dbURL;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var Schema = mongoose.Schema;


if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongooseUri, db.options);
}
var equipments = new Schema({
  whiteboard : Boolean,
  computer : Boolean,
  projector : Boolean,
  disabilityFriendly : Boolean,
  podium : Boolean
})
var roomInfos = new Schema({
  roomLocation : String,
  roomNumber : Number,
  capacity : Number,
  equipment : equipments,
  mapPath : String 
  
})
module.exports = mongoose.model('roominfo', new Schema({
    //Course Basic Information
    provider : String,
    roomInfo : [roomInfos]
}));

