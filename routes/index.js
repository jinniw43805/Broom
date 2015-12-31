var express = require('express');
var passport = require('passport');
var promise = require('jquery-deferred');
var router = express.Router();
var util = require('util');
var userApi = require('../src/userApi');
var courseApi = require('../src/courseApi');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});


// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook'),function(err){});

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	  successRedirect: '/success',
	  failureRedirect: '/error'
}));

router.get('/success',isLoggedIn ,function(req, res, next){

	var GetCourseDataApi = courseApi.getUserCourseDatas(req.user.oauthID);
	promise.when(GetCourseDataApi).done(function(){

		console.log("Show current res:  "+ JSON.stringify(arguments[0],null,2));
		// console.log(arguments[0]);
		// console.log("userCourse->>>>>>"+JSON.stringify(arguments[0]));
		var FetchCourseData = arguments[0];

		res.cookie('fbuid',req.user.oauthID, { maxAge: 900000, httpOnly: true });
		res.render('dashboard', {
			user : req.user,
			isRegCompletely : req.user.isRegCompletely,
			CourseData : FetchCourseData
		});

	});

	// console.log("user information send to front:"+req.user);

});

router.get('/error', function(req, res, next) {
	  res.send("Error logging in.");
});

router.get('/test', function(req, res, next) {
	  res.render("dialogs/addCourse",{
	  	CourseData:" "
	  });
});

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



router.post('/completeData', function(req, res, next) {
	console.log("try to completeData");
	// console.log(req.body);
	// console.log(req.cookies);
	var CompleteDataApi = userApi.setUserCompleteInfo(req.body,req.cookies.fbuid);
		promise.when(CompleteDataApi).done(function(){
		res.redirect('/success');
	});
});

router.post('/addNewCourse',function(req, res, next) {
	// console.log(req.body);
	var AddCourseApi = courseApi.setNewCourse(req.body);
		promise.when(AddCourseApi).done(function(){
			console.log("this time:"+req.user.ownCourses);
		res.redirect('/success');
	});
});


router.post('/addNewNote',function(req, res, next) {
	console.log(req.body);
	var AddNoteApi = courseApi.setNewNote(req.body);
		promise.when(AddNoteApi).done(function(){
			// console.log("this time:"+req.user.ownCourses);
		res.redirect('/success');
	});

});



module.exports = router;

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	else{
	// if they aren't redirect them to the home page
	res.redirect('/');
	}
}
function isRegCompletelyRight(req, res, next) {

}
