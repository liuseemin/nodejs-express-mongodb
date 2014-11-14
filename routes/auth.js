function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    switch(req.path) {
      case '/login':
      case '/signup':
        next();
        break;
      default:
        res.send('<h2>Please Login!<h2><h4>Redirect in 3 secs...</h4><script>setTimeout(function(){location.href="/login"}, 3000);</script>');
    }
  } else if (typeof req.session.user_id != 'undefined') {
    if (req.session.access == 'admin') {
      switch(req.path) {
        case '/login':
        case '/signup':
          res.redirect('/userpage');
          break;
        default:
          next();
      }
    } else {
      switch(req.path) {
        case '/login':
        case '/signup':
          res.redirect('/userpage');
        case '/manage':
          res.send('<h2>You are not authorized to view this page</h2>');
        default:
          next();
      }
    }
  }
}

module.exports = checkAuth;