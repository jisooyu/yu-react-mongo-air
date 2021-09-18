const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
// ask passport to keep track of user session. keep track of user authentication status
const passport = require('passport')        
const keys = require('./config/keys');

// User를 passport보다 먼저 import 해야 함
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

// register cookieSession
app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey]
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  
  require('./routes/authRoutes')(app);
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT);
