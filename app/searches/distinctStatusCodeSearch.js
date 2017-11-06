module.exports = function(req,res) {
	var sql = require("seriate");
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.projectID);
	if (config.error) {
		res.send("Connection Error");
		return;
	}
	sql.execute( config, {
		query: sql.fromFile("../sql/GetDistinctStatusCodes")
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at get distinct status codes");
		res.send({string: err.message, error: true});
	});
};