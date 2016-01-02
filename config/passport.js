var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// User model
var User = require('../models/userInfo.js');
// The auth variables
var FacebookConf= require('../config/auth.js');

module.exports = function(passport) {

    passport.use(new FacebookStrategy({

        clientID: FacebookConf.facebookAuth.clientID,
        clientSecret: FacebookConf.facebookAuth.clientSecret,
        callbackURL: FacebookConf.facebookAuth.callbackURL,
        profileFields: ['id','name','picture.type(large)', 'emails', 'displayName', 'about', 'gender']
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
        // console.log(accessToken);
        // console.log(profile);
        //done(null, profile);
        User.findOne({
            oauthID: profile.id
        }, function(err, user) {
            if (err) {
                console.log(err);
            }
            if (!err && user != null) {
                //can find user
                done(null, user);

            } else {
                console.log("email: "+JSON.stringify(profile,null,2));
                if(profile.emails ===undefined ){
                    console.log("get email error , ");
                    profile.emails= [];
                    profile.emails[0]="";
                }
                console.log("start storing...");
                var StoreUser = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    emails: profile.emails[0].value,
                    photo: profile.photos[0].value,
                    gender: profile.gender,
                    provider: profile.provider,
                    isRegCompletely: false,
                    created: Date.now()
                });
                StoreUser.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("saving user ...");
                        done(null, StoreUser);
                    }
                });
            }
        });

    });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
        });
    });


};