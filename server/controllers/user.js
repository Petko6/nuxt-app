/**
 * GET /logout
 * Log out.
 */
exports.logout = function (req, res, next) {
  req.session.regenerate(function (err) {
    if (err) {
      console.log('failed to regenerate session')
    }
    req.session.destroy(function (err) {
      if (err) {
        console.log('failed to destroy session')
      }

      req.user = null
      req.session = null
      res.redirect('/')
    })
  })
}
