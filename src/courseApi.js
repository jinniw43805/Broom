
'use strict';

var promise = require('jquery-deferred');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var Course = require('../models/courseInfo.js');
var User = require('../models/userInfo.js');
var userApi = require('./userApi');
var tokenGener = require('./cocoTokenGener.js');

function setNewCourse(data,deferred){
    var res={};
    console.log(data);

    var courseID = tokenGener.getNewCourseId();
    console.log("courseID"+courseID);
    var courseName = data.courseName;
    var ownerName = data.ownerName;
    var ownerFBuid = data.ownerFBuid;
    var acadeYear = data.acadeYear;
    var forClass = data.forClass;

    Course.findOne({courseID:courseID}, function(err, course) {
        if(err){
            console.log(err);
        }
        if(!course){
            console.log("Course not exist!!!");
            var StoreCourse = new Course({
                courseID: courseID,
                courseName: courseName,
                ownerFBuid: ownerFBuid,
                ownerName: ownerName,
                acadeYear: acadeYear,
                forClass: forClass,
                created: Date.now()
            });

            StoreCourse.save(function(err) {
                if(err){
                    console.log(err);
                }else{
                    console.log("add success!!");
                }
            });

            userApi.addNewCourse(ownerFBuid,courseName,courseID);

        }else{
            console.log("courseID hit!!");
        }
    });


    console.log("new id :"+tokenGener.getNewCourseId());
    deferred.resolve(res);
}


module.exports = {
    setNewCourse: function(data){
        var deferred = new promise.Deferred();
        setNewCourse(data,deferred);
        return deferred;

    },
    getCourseInfo: function(fbuid){
        //return full course information to let front render.
    }
}