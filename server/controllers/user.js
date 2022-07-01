/**
 * GET /logout
 * Log out.
 */
exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.log('Error : Failed to destroy the session during logout.', err)
      return next(err)
    } else {
      req.session = null
      req.user = null

      res.redirect('/')
      console.log('logout succesful')
    }
  })
}
