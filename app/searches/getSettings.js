module.exports = function(req,res) {
	var sql = require("seriate");
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection("demoHub");

	var params = {
		projectID: {
			type: sql.VARCHAR,
			val: req.query.projectID
		}
	};

	sql.execute( config, {
		query: sql.fromFile("../sql/GetAppSettings"),
		params: params
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at get mobile app settings");
		res.send({string: err.message, error: true});
	});
};