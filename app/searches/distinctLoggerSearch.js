module.exports = function(req,res) {
	var sql = require("seriate");
	var decideConnection = require("../connections/decideConnection");
	var logConfig = decideConnection(req.query.projectID);
	if (logConfig.error) {
		res.send("Connection Error");
		return;
	}
	sql.execute( logConfig, {
		query: sql.fromFile("../sql/GetDistinctLoggers")
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at get distinct loggers");
		res.send({string: err.message, error: true});
	});
};