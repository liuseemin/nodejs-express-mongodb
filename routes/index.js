var express = require('express');
var router = express.Router();
var hash = require('./hash.js')

function checkAuth(req, res, next) {
  /*if (req.path=='/login' || req.path=='/signup') {
    if (typeof req.session.user_id != 'undefined') {
      res.redirect('/userpage');
    } else {
      next();
    }
  } else {
    if (!req.session.user_id) {
      res.send('You are not authorized to view this page');
    } else {
      next();
    }
  }*/

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
var pool = [];

/*setup chechauth*/
router.all('*', checkAuth);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'The Resistance Game' });
});

/* POST login page. */
router.post('/login', function(req, res) {
  var db = req.db;
  var namecheck = req.body.username;
  var pass = req.body.password;
  console.log('Login ' + namecheck + ":" + pass);
  db.users.findOne({username: namecheck}, function(err, user) {
    if (err) {
      console.log('read db error!');
    } else if (user) {
      var salt = user.salt;
      console.log(salt);
      var passhash = hash.create(pass, salt);
      if (passhash == user.password) {
        req.session.user_id = user.username;
        req.session.access = user.role;
        res.redirect('/userpage');
      } else {
        res.render('login', { title: 'The Resistance Game', loginmsg: 'Wrong username or password!' });
      }
    } else {
      res.render('login', { title: 'The Resistance Game', loginmsg: 'Wrong username or password!' });
    }
  });
});

/* GET userpage page. */
router.get('/logout', function(req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});

/* GET userpage page. */
router.get('/userpage', function(req, res) {
  res.render('userpage', { title: 'User page' });
});

/* GET signUp page. */
router.get('/signup', function(req, res) {
  if (req.query.check) {
  	var check = req.query.check;
  	var db = req.db;
  	console.log('Get ajax query: ' + req.query.check);
  	db.users.find({username: check}, function(err, users) {
  		if (err) {
  			console.log('Check: error.');
  			res.send('error');
  		} else {
  			if (users.length == 0) {
  				console.log('Check: pass.');
  				res.send('pass');
  			} else {
  				console.log('Check: not pass.');
  				res.send('notpass');
  			}
  		}
  	});
  } else {
  	res.render('signup', { title: 'Sign Up' });
  }
});

/* POST sign up request. */
router.post('/signup', function(req, res) {
  var randsalt = hash.saltGen(pool);
  var passhash = hash.create(req.body.password, randsalt);
  var user = {
    username: req.body.username,
    password: passhash,
    sex: req.body.sex,
    salt: randsalt,
    role: 'user'
  };
  var db = req.db;
  db.users.insert(user, function() {
    res.render('success');
  });
});

/* GET try bootstrap page. */
router.get('/manage', function(req, res) {
  var db = req.db;
  db.users.find(function(err, users) {
  	res.render('manage', { title: 'Admin Manage Page', userlist: users});
  });
});
  
module.exports = router;
