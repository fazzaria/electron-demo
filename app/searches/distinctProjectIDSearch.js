module.exports = function(req,res) {
	var sql = require("seriate");
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.database);
	sql.execute( config, {
		query: sql.fromFile("../sql/GetDistinctProjectIDs")
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at get distinct project IDs");
		res.send({string: err.message, error: true});
	});
};