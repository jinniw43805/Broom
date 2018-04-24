var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var db = require('../config/db.js');
var mongodbUri = db.dbURL;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var Schema = mongoose.Schema;


if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongooseUri, db.options);
}

var occupys = new Schema({
  timestamp : Number,
  date : String,
  oStatus : String
})
var dataset = new Schema({
  //roomID : String,
  info : {
    type : Schema.Types.ObjectId,
    ref : 'roominfo'
  },
  occupys: [occupys]
})
module.exports = mongoose.model('roomstatus', new Schema({
    //Course Basic Information
    provider : String,
    data : [dataset]
}));

