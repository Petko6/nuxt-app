"use strict";
process.env.DEBUG = 'nuxt:*';
const { loadNuxt, build } = require('nuxt');
/**
 * Module dependencies.
 */
 const express = require('express');
 const session = require('express-session');
 const bodyParser = require('body-parser');
 const logger = require('morgan');
 const errorHandler = require('errorhandler');
 const lusca = require('lusca');
 const dotenv = require('dotenv');
 const MongoStore = require('connect-mongo');
 const mongoose = require('mongoose');
 const passport = require('passport');
const path = require('path');
const cors = require('cors');


 /**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path:__dirname+'/./../.env' });

/**
 * dotenv variables
 */


/**
 * Controllers (route handlers).
 */
 const apiController = require('./controllers/api');
 const userController = require('./controllers/user');

/**
 * API keys and Passport configuration.
 */
 const passportConfig = require('./config/passport');
 
 /**
 * Create Express server.
 */
const app = express();

const port = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

/**
 * Connect to MongoDB.
 */
 mongoose.connect(process.env.MONGODB_URI);
 mongoose.connection.on('error', (err) => {
   console.error(err);
   console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
   process.exit();
 });

 /**
 * Express configuration.
 */
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // Two weeks in milliseconds
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
// app.use((req, res, next) => {
//     res.locals.user = req.user;
//     next();
// });
// app.use((req, res, next) => {
//     // After successful login, redirect back to the intended page
//     if (!req.user
//       && req.path !== '/login'
//       && req.path !== '/signup'
//       && !req.path.match(/^\/auth/)
//       && !req.path.match(/\./)) {
//       req.session.returnTo = req.originalUrl;
//     } else if (req.user
//       && (req.path === '/' || req.path.match(/^\/api/))) {
//       req.session.returnTo = req.originalUrl;
//     }
//     next();
//   });

  /**
 * Primary app routes.
 */
app.post('/logout', userController.logout);

/**
 * API examples routes.
 */
 app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);

 app.get('/auth/steam', passport.authenticate('openid', { state: 'SOME STATE' }));
 app.get('/auth/steam/callback', passport.authenticate('openid', { failureRedirect: '/auth/steam'}), function (req, res, next) {
     res.redirect("/");
   });

  /**
   * Error Handler.
   */
   if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
  } else {
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send('Server Error');
    });
  }
 
async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

 

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt)
  }

   // Render every route with Nuxt
   app.use(nuxt.render)

  // Listen the server
  app.listen(port, '0.0.0.0')
  console.log('Server listening on `localhost:' + port + '`.')
};

start()

module.exports = app;


