var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var db = require('../config/db.js');
var mongodbUri = db.dbURL;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var Schema = mongoose.Schema;


if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongooseUri, db.options);
}
module.exports = mongoose.model('Courses', new Schema({
    name: String,
    courseDatas: [String],
    ownerFBuid: String,
    ownerName: String,
    member: [String],
    created: String
}));