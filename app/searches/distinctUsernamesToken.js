module.exports = function(req,res) {
	var sql = require("seriate");
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection("mFosMobileHub2Prod");
	var params = {
		projectID: {
			type: sql.VARCHAR,
			val: req.query.projectID
		}
	};
	sql.execute( config, {
		query: sql.fromFile("../sql/GetDistinctUsernamesToken"),
		params: params
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at get distinct usernames for token search");
		res.send({string: err.message, error: true});
	});
};