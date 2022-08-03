'use strict'
const dotenv = require('dotenv').config({ path: __dirname + '/./../.env' })
/**
 * Module dependencies.
 */
const express = require('express')
const session = require('express-session')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const lusca = require('lusca')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const flash = require('express-flash')
const { Nuxt, Builder } = require('nuxt')
/**
 * dotenv variables
 */
process.env.DEBUG = 'nuxt:*'
const port = process.env.PORT || 3000
const host = process.env.HOST || '127.0.0.1'
const isDev = process.env.NODE_ENV !== 'production'

/**
 * Create Express server.
 */
const app = express()

/**
 * Controllers (route handlers).
 */
const apiController = require('./controllers/api')
const userController = require('./controllers/user')

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport')

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log(
    '%s MongoDB connection error. Please make sure MongoDB is running.'
  )
  process.exit()
})

/**
 * Express configuration.
 */

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  session({
    name: 'session',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 86400000 }, // One day in milliseconds
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      autoRemove: 'interval',
      autoRemoveInterval: '10',
    }),
    unset: 'destroy',
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(logger('dev'))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.disable('x-powered-by')
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = req.originalUrl
  } else if (req.user && (req.path === '/' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl
  }
  next()
})

const router = express.Router()

app.use('/', router)

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

/**
 * Primary app routes.
 */
router.post('/logout', userController.logout)

/**
 * API examples routes.
 */
router.get(
  '/api/steam',

  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  apiController.getSteam
)

router.get(
  '/auth/steam',

  passport.authenticate('openid', { state: 'SOME_STATE' })
)
router.get(
  '/auth/steam/callback',

  passport.authenticate('openid', {
    //failureRedirect: '/auth/steam',
    failureRedirect: '/auth/steam',
  }),
  (req, res) => {
    //res.redirect(req.session.returnTo)
    res.redirect('/')
  }
)

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler())
} else {
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Server Error')
  })
}

const config = require('../nuxt.config.js')

const nuxt = new Nuxt(config)
// Start build process in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}
app.use(nuxt.render)

//Listen the server
app.listen(port, '0.0.0.0')
console.log('Server listening on localhost:' + port) // eslint-disable-line no-console
