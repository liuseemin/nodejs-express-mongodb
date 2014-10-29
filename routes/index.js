var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'The Resistance Game' });
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

/* GET try bootstrap page. */
router.get('/readdb', function(req, res) {
  var db = req.db;
  db.users.find({username: "liu"}, function(err, users) {
  	res.render('readdb', { title: 'readdb', userlist: users});
  });
});
  
module.exports = router;
