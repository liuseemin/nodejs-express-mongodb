function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    switch(req.path) {
      case '/login':
      case '/signup':
        next();
        break;
      default:
        res.send('You are not authorized to view this page');
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
          res.send('You are not authorized to view this page');
        default:
          next();
      }
    }
  }
}

module.exports = checkAuth;