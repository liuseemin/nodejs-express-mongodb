var express = require('express');
var router = express.Router();
var hash = require('./hash.js')
var checkAuth = require('./auth.js');

var pool = [];

/*setup chechauth*/
router.all('*', checkAuth);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Small Chat' });
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Small Chat' });
});

/* POST login page. */
router.post('/login', function(req, res) {
  var db = req.db;
  var namecheck = req.body.username;
  var pass = req.body.password;
  //console.log('Login ' + namecheck + ":" + pass);
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
        res.render('login', { title: 'Small Chat', loginmsg: 'Wrong username or password!' });
      }
    } else {
      res.render('login', { title: 'Small Chat', loginmsg: 'Wrong username or password!' });
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
  res.render('userpage', { title: 'User page' , username: req.session.user_id, role: req.session.access});
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
  if (req.query.action) {
    var id = req.query.id;
    switch(req.query.action) {
      case 'delete':
        db.users.remove({"_id": db.ObjectId(id)}, function(err, doc) {
          res.send(id);
        });
        break;
      case 'upgrade':
        db.users.update({"_id": db.ObjectId(id)}, {$set: {role: 'admin'}}, function(err, doc) {
          res.send(id);
        });
        break;
      case 'downgrade':
        db.users.update({"_id": db.ObjectId(id)}, {$set: {role: 'user'}}, function(err, doc) {
          res.send(id);
        });
        break;
    }
  } else {
    db.users.find(function(err, users) {
      res.render('manage', { title: 'Admin Manage Page', userlist: users});
    });
  }
});

/* Deal with account delete request */
router.get('/deluser', function(req, res) {
  
  console.log('Admin delete user_id: ' + id);
  var db = req.db;
  
});
  
module.exports = router;
