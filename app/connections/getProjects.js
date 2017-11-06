var Config = require('electron-config');

var getProjects = function(req, res) {
	var config = new Config();

	if (config.store[req.query.setName]) {
		res.send(config.store[req.query.setName]);
	} else {
		res.send([]);
	}
};

module.exports = getProjects;