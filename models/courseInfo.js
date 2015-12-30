var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var db = require('../config/db.js');
var mongodbUri = db.dbURL;
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var Schema = mongoose.Schema;


if (mongoose.connection.readyState === 0) {
    mongoose.connect(mongooseUri, db.options);
}

var NotesModal = new Schema({
    noteName: String,
    noteID: String
});
module.exports = mongoose.model('Courses', new Schema({
    //Course Basic Information
    courseID: Number,
    courseName: String,
    ownerFBuid: Number,
    ownerName: String,
    acadeYear: String,
    forClass: String,
    //Coures Datas
    courseDatas: [NotesModal],
    //Join Members
    joinMember: [String],
    //Counts 
    joinMemberCount: Number,
    noteCount: Number,
    //Create Time
    created: String
}));
