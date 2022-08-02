/**
 * GET /logout
 * Log out.
 */
exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.log("Error : Logout wasn't succesful")
    }
    res.redirect('/')
  })
}
