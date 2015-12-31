
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
                // console.log("length------->ownCourses");
                // console.log(res.datas.ownCourses.length);

                // console.log(res.datas.ownCourses);

                // console.log("length------->joinCourses");
                // console.log(res.datas.joinCourses.length);

                // console.log("Stage 1");
                callback(null,res);
            });

        },function(res,callback){

            // console.log("Show current res data: "+ JSON.stringify(res));
            asyncEachObject(res.datas.ownCourses,
                function findCourseInfo(value, key, nextEach) {
                    Course.findOne({courseID : res.datas.ownCourses[key].courseID}, function(err, course){
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(course){
                                    var obj = {

                                    }
                                    res.datas.ownCourses[key].NoteData = course.courseDatas;
                                    
                                    // var NotesData = {
                                    //     "noteName": "",
                                    //     "noteID": ""
                                    // };
                                    // obj[0].test = "test123";
                                    // console.log("find!!!!");
                                    // console.log("course datas"+course.courseDatas);
                                    // console.log("ownCourses Lengtg"+res.datas.ownCourses.length);
                                    
                                    // var jsonobj =  JSON.stringify(res.datas.ownCourses[key]);

                                    // jsonobj.NoteData.push({
                                    //     noteName : "test",
                                    //     noteID : "testID"
                                    // });

                                    // console.log("My json: "+jsonobj);
                                    // res.datas.ownCourses[key].courseDatas.push("test");
                                    // res.datas.ownCourses[key].courseName="";

                                    // res.datas.ownCourses[key].test=[];
                                    // res.datas.ownCourses[key].test.push("test!!!");
                                    // res.datas.ownCourses[key].courseDatas.push(course.courseDatas);

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
                        // console.log(res);
                        // console.log("stage 2");
                        deferred.resolve(res);

                        // callback(null,res);
                        // deferred.resolve(res);
                    }
                }
            );            
            // var datas = [1,2];
            // async.forEachOf(datas, function(value, key,eachCallback){
                // console.log(res.datas.ownCourses.length)
                // Course.findOne({courseID:value.courseID}, function(err, course){
                //     if(err){
                //         console.log(err);
                //     }else{
                //         if(course){
                //             //find
                //                 console.log(datas[key]);
                //                 // // res.datas.ownCourses[key].courseDatas = [];
                //                 // // res.datas.ownCourses[key].courseDatas.push(course.courseDatas);
                //                 // console.log(JSON.stringify(res.datas));
                //         }else{
                //             //error find
                //         }
                //     }
                // });
            // },function eachCallback(err){

            // })
            // });
            // console.log("my Res is---->"+res.datas.joinCourses);
            // for(var i=0; i<res.datas.ownCourses.length; i++){
            //     //need respond courseName ,acadeYear ,forClass , joinMember
            //     // console.log(res.datas.ownCourses[0]);
                // Course.findOne({courseID:res.datas.ownCourses[i].courseID},function(err, course){
                //     if(err){
                //         console.log(err);
                //     }else{
                //         if(course){
                //             //find course                
                //             console.log("find data!!!!"+course);
                //             //res.datas.ownCourses[i].courseDatas = course.courseDatas;
                //         }else{
                //             //cant find course
                //         }
                //     }
                // });
                // console.log("my res is :");
                // console.log(res);

        }
    ],function(res) {
        // console.log("stage 3");
        // console.log("My respond:"+res);
    });
    // // userApi.getUserCourseInfo(fbuid,deferred);
    // User.findOne({oauthID:fbuid}, function(err, user){
    //     //return own data and join data
    //     console.log("data"+ user.ownCourses);
    //     res.datas.ownCourses=user.ownCourses;
    //     for(var i=0 ; i<user.joinCourses.length;i++){
    //         console.log("start use "+user.joinCourses[i].courseID+"to compare");
    //         var flag = 0
    //         for(var j=0 ; j<user.ownCourses.length;j++){
    //             console.log("income obj: "+user.ownCourses[j].courseID+"to compare");
    //             if(user.ownCourses[j].courseID === user.joinCourses[i].courseID){
    //                 console.log("match!"+user.ownCourses[j].courseID);
    //                 flag = 1;   
    //                 break;
    //             }
    //         }
    //         if(flag==1){
    //             continue;
    //         }else{
    //             res.datas.joinCourses.push(user.joinCourses[i]);
    //         }
    //     }
    // console.log("length------->ownCourses");
    // console.log(res.datas.ownCourses.length);

    // console.log(res.datas.ownCourses);
    // console.log("length------->joinCourses");
    // console.log(res.datas.joinCourses.length);

    // });


    // //A for loop to fetch data from OwnCourse from Course collection


    // //A for loop to fetch data from JoinCourse from Course collection

    // for(var i=0; i<res.datas.joinCourses.length;i++){

    //     var q_data = res.datas.joinCourses[i];


    //     Course.findOne({joinCourses:q_data.courseID},function(err, course){
    //         console.log("find data!!!!");
    //     });
    // }



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