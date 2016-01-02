
'use strict';

var promise = require('jquery-deferred');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var Course = require('../models/courseInfo.js');
var User = require('../models/userInfo.js');
var userApi = require('./userApi');
var tokenGener = require('./cocoTokenGener.js');
var async = require('async');
var asyncEachObject = require('async-each-object')

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
        // deferred.resolve(res);

   async.waterfall([
        function(callback) {
            User.findOne({oauthID:fbuid}, function(err, user){
                //return own data and join data('name', 'value')
                res.datas.ownCourses=user.ownCourses;
                for(var i=0 ; i<user.joinCourses.length;i++){
                    // console.log("start use "+user.joinCourses[i].courseID+"to compare");
                    var flag = 0
                    for(var j=0 ; j<user.ownCourses.length;j++){
                        // console.log("income obj: "+user.ownCourses[j].courseID+"to compare");
                        if(user.ownCourses[j].courseID === user.joinCourses[i].courseID){
                            // console.log("match!"+user.ownCourses[j].courseID);
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
                callback(null,res);
            });

        },function(res,callback){
            asyncEachObject(res.datas.ownCourses,
                function findCourseInfo(value, key, nextEach) {
                    Course.findOne({courseID : res.datas.ownCourses[key].courseID}, function(err, course){
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(course){
                                    res.datas.ownCourses[key].NoteData = course.courseDatas;
                            }
                            else{
                                //error find
                            }
                        }
                        nextEach();
                    });
                },
                function complete(error) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                         callback(null,res);
                    }
                }
            );
        },function(res,callback){
            asyncEachObject(res.datas.joinCourses,
                function findCourseInfo(value, key, nextEach) {
                    Course.findOne({courseID : res.datas.joinCourses[key].courseID}, function(err, course){
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(course){
                                    res.datas.joinCourses[key].NoteData = course.courseDatas;
                            }
                            else{
                                //error find
                            }
                        }
                        nextEach();
                    });
                },function complete(error) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        // console.log(res);
                        // console.log("stage 2");

                        // callback(null,res);
                        // deferred.resolve(res);
                         callback(null,res);
                    }
                }
            );            
        }
    ],function(err,res) {
        console.log(res);
        deferred.resolve(res);
    });
 
}
function setUserJoinCourse (data,deferred){
    var res={};
    var joincourseId = data.joincourseId;
    var ownerFBuid = data.ownerFBuid;

    Course.findOne({courseID:joincourseId}, function(err, course){
        if(err){
            console.log(err);
        }else{
            if(course){
                var courseName = course.courseName;
                console.log("find the course"+courseName);
                course.joinMember.push(ownerFBuid);
                course.save(function(err ) {

                    if(err){
                        console.log(err);
                    }else{
                        // console.log("store success!!!!");
                        User.findOne({oauthID:ownerFBuid}, function(err, user){
                            var CourseData = {
                                courseName: courseName,
                                courseID: joincourseId
                            }            
                            user.joinCourses.push(CourseData);
                            user.save(function(err) {
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("write back to user");

                                    deferred.resolve(res);  
                                }
                            });
                        });
                    }
                })
            }else{ 
                res= {
                    type :"error",
                    resultCode: "E01"
                }
                console.log("can't find course");

                deferred.resolve(res);
            }

        }
    });
}
function isExistCourse(data,deferred){
    var res={};

    var noteID = data.noteid;
    var userID = data.userid;
    Course.findOne({'courseDatas.noteID' : noteID},function(err , course){
        if(err){
            console.log(err);
        }else{
            if(course){
                console.log("find note!!!");
                res = {
                    type : "data",
                    data : {
                        courseId : course.courseID,
                        courseName : course.courseName

                    }
                }

                deferred.resolve(res);

                // var data = {
                //     joincourseId : course.courseID,
                //     ownerFBuid : userID
                // }
                // setUserJoinCourse(data, deferred);

            }else{
                //not find note
                console.log("cant find note!!!");
                res = {
                    type : "err",
                    resultCode : "E02"
                }
                deferred.resolve(res);
            }
        }
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
    },
    setUserJoinCourse : function (data){
        var deferred = new promise.Deferred();
        setUserJoinCourse(data,deferred);
        return deferred;

    },
    isExistCourse :function(data){
        var deferred = new promise.Deferred();
        isExistCourse(data,deferred);
        return deferred;        
    }

}