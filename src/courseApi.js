
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

            userApi.addNewCourse(ownerFBuid,courseName,courseID,deferred);

        }else{
            console.log("courseID hit!!");
            //return error code about hit .
        }
    });


    console.log("new id :"+tokenGener.getNewCourseId());
    // deferred.resolve(res);
}


function setNewNote(data,deferred){
    var res={};
    var courseID = data.CourseID;
    var noteName = data.noteName;
    var noteID = tokenGener.getNewNoteId();
    // console.log(courseID);
    // console.log(noteName);
    
    Course.findOne({courseID:courseID}, function(err, course){
        if(err){
            console.log(err);
        }else{
            if(course){
                //start storing to courseCollection
                var noteData = {
                    noteName :noteName,
                    noteID : noteID
                }
                // console.log("NoteDATA:--->"+NoteData.NoteName+","+NoteData.NoteID);
                course.courseDatas.push(noteData);
                course.save(function(err) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("add success");
                    }
                });
            }else{
                //error adding
            }
        }
    });
    deferred.resolve(res);
}
function getUserCourseDatas(fbuid,deferred){
    var res = {
        "type": "data",
        "datas":{
            "ownCourses" : [],
            "joinCourses" : []
        }
    };  
    User.findOne({oauthID:fbuid}, function(err, user){
        //return own data and join data
        res.datas.ownCourses = user.ownCourses;
        for(var i=0 ; i<user.joinCourses.length;i++){
            console.log("start use "+user.joinCourses[i].courseID+"to compare");
            var flag = 0
            for(var j=0 ; j<user.ownCourses.length;j++){
                console.log("income obj: "+user.ownCourses[j].courseID+"to compare");
                if(user.ownCourses[j].courseID === user.joinCourses[i].courseID){
                    console.log("match!"+user.ownCourses[j].courseID);
                    flag = 1;   
                    break;
                }
            }
            if(flag==1){
                continue;
            }else{
                res.datas.joinCourses.push(user.joinCourses[i]);
            }
        }


        console.log("user data:--->"+JSON.stringify(res));
    deferred.resolve(res);
    });


}
module.exports = {
    setNewCourse: function(data){
        var deferred = new promise.Deferred();
        setNewCourse(data,deferred);
        return deferred;

    },
    setNewNote: function(data){
        var deferred = new promise.Deferred();
        setNewNote(data,deferred);
        return deferred;
    },
    getUserCourseDatas: function(fbuid){
    //return full course information to let front render.
        var deferred = new promise.Deferred();
        getUserCourseDatas(fbuid,deferred);
        return deferred;
    }

}