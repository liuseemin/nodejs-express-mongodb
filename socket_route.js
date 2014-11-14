function messageProcessor(rule, msg) {

	function linkinize(msg) {
		return '<a href="' + msg + '">' + msg + '</a>';
	}

	// custimized rule
	for (var i in rule) {
		if (rule[i].regex.test(msg)) {
			msg = rule[i].action(msg);
		}
	}

	// intrinsic rule
	var incRule = {
		http:	{ regex: /http:\/\//i, 	action: linkinize},
		https:  { regex: /https:\/\//i, action: linkinize},
		ftp:  	{ regex: /ftp:\/\//i, 	action: linkinize},
		ftps: 	{ regex: /ftps:\/\//i, 	action: linkinize},
		script: { regex: /<script.*<\/script>/i, 	action: function(msg) { return msg.replace(/<script.*<\/script>/i, '**filtered messsage**')}}
	}
	
	for (var i in incRule) {
		if (incRule[i].regex.test(msg)) {
			msg = incRule[i].action(msg);
		}
	}

	return msg;
}

module.exports = function(io, db){

	var userlist = {};
	var MsgSpecRule;

	io.sockets.on('connection', function (socket) {
		socket.on('login', function (data) {
			db.users.findOne({username: data.username}, function(err, user) {
				MsgSpecRule = user.rule;
			});
			userlist[socket.id] = data.username;
			io.emit('updateUsers', { userlist: userlist });
		});

	    socket.on('disconnect', function (data) {
	    	delete userlist[socket.id];
	    	io.emit('updateUsers', { userlist: userlist });
	    });

	    socket.on('logout', function (data) {
	    	delete userlist[socket.id];
	    	io.emit('updateUsers', { userlist: userlist });
	    });

	    socket.on('talkto', function (data) {
	    	console.log('talkto: ' + data.id + ': ' + data.msg);
	    	var f_msg = messageProcessor(MsgSpecRule, data.msg);
	    	console.log('filtered: ' + data.id + ': ' + f_msg);
	    	var date = new Date();
	    	var sendtime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	    	socket.broadcast.to(data.id).emit('incomeMsg', {from: userlist[socket.id], from_id: socket.id, msg: f_msg, time: sendtime, self: false});
	    	socket.emit('incomeMsg', {from: userlist[socket.id], from_id: socket.id, msg: f_msg, time: sendtime, self: true, to: userlist[data.id]});
	    });
	});
};