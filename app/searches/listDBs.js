module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var configs = decideConnection("All of them");
	res.send(configs);
};