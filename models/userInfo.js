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

var CoursesModal = new Schema({
    courseName: String,
    courseID: Number,
    NoteData: [NotesModal]
});
var recordModel = new Schema({
  roomID : {
    type : Schema.Types.ObjectId,
    ref : 'roomstatus'
  },
  hourBit : Number,
  data: String
});

module.exports = mongoose.model('User', new Schema({
    // User basic 
    localUserName: String,
    localPassword: String,
    isAdmin: Boolean,
    oauthID: Number,
    name: String,
    emails: String,
    photo: String,
    gender: String,
    provider: String,
    // School Information
    isRegCompletely: Boolean,
    university: String,
    uni_department: String,
    graduation: String,
    gra_department: String,
    contributeVal: Number,
    // User Courses
    ownCourses: [CoursesModal],
    joinCourses: [CoursesModal],
    recordModels : [recordModel],
    created: String
}));


