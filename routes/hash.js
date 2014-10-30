var crypto = require('crypto');

function hash(password, salt) {
	var hexhash = crypto.createHash('sha512');
	hexhash.update(password);
	hexhash.update(salt);
	return hexhash.digest('base64');
}

function saltGen(pool) {
	//return crypto.randomBytes(64);
	return hashCodeGenerator(pool, 64);
}

function hashCodeGenerator(Hashpool, num) {
	var code = '';
	while(code.length < num) {
		for (var i = 0; i < num; i++) {
			var rand = Math.ceil(Math.random() * 72 % 36) + 47;
			var charcode;
			if (rand <= 57)
				charcode = String.fromCharCode(rand);
			else
				charcode = String.fromCharCode(rand + 7);
			code = code + charcode;
		}
		if (Hashpool.indexOf(code) != -1) code = '';
	}
	Hashpool.push(code);
	return code;
}

module.exports.create = hash;
module.exports.saltGen = saltGen;