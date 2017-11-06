module.exports = function(req,res) {
	var sql = require("seriate");
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection("demoHub");
	sql.execute( config, {
		query: sql.fromFile("../sql/GetDistinctProjectIDsSettings")
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at get distinct project IDs for settings");
		res.send({string: err.message, error: true});
	});
};