module.exports = function(io){

	var userlist = {};

	io.sockets.on('connection', function (socket) {
		socket.on('login', function (data) {
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
	    	socket.broadcast.to(data.id).emit('incomeMsg', {from: userlist[socket.id], from_id: socket.id, msg: data.msg});
	    });
	});
};