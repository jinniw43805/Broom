var express = require('express');
var passport = require('passport');
var promise = require('jquery-deferred');
var router = express.Router();
var util = require('util');
var userApi = require('../src/userApi');
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
	res.cookie('fbuid',req.user.oauthID, { maxAge: 900000, httpOnly: true });
	  res.render('dashboard', {
	  	user : req.user,
	  	isRegCompletely : req.user.isRegCompletely,
	  });

});

router.get('/error', function(req, res, next) {
	  res.send("Error logging in.");
});

router.get('/test', function(req, res, next) {
	  res.render("testpadejs");
});

router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



router.post('/completeData', function(req, res, next) {
	// console.log(req.body);
	// console.log(req.cookies);
	var Api= userApi.setUserCompleteInfo(req.body,req.cookies.fbuid);
		promise.when(Api).done(function(){
		res.redirect('/success');

	});
});

router.post('/addNewCourse',function(req, res, next) {
	console.log(req.body);
	res.redirect('/success');
});


router.post('/addNewNote',function(req, res, next) {
	
});



module.exports = router;

function isLoggedIn(req, res, next) {
	console.log("req.isAuthenticated"+req.isAuthenticated());
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
