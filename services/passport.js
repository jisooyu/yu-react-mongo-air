const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const keys = require('../config/keys');

const User = mongoose.model('users')

// take our user model and put some piece of info identifying the user into the cookie
  // error가 발생 할 리 가 없 으므로 set the first argument of the done function as null
  // user is mongoose model instance
passport.serializeUser((user, done)=> {
  done(null, user.id)
})

passport.deserializeUser((id, done) =>{
  User.findById(id)
    .then(user => {
      done(null, user)
    })
})

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    // done의 의미는 passport에게 우리 일은 여기서 끝났다는 것을 알려주는 것
     // 동일한 user가 두번 저장되지 않도록 함
    (accessToken, refreshToken, profile, done)=> {
      User.findOne({googleId: profile.id}).then(existingUser => {
        if (existingUser){
          done(null, existingUser)
        } else {
          new User({googleId: profile.id})
          .save()
          .then(user => done(null, user))
        }
      })
    }
  )
);
