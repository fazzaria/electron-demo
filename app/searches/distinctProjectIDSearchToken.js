module.exports = function(req,res) {
	var sql = require("seriate");
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection("mFosMobileHub2Prod");
	sql.execute( config, {
		query: sql.fromFile("../sql/GetDistinctProjectIDsToken")
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at get distinct project IDs for token search");
		res.send({string: err.message, error: true});
	});
};