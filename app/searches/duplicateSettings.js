var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection("demoHub");
	
	var params = {
		oldProject: {
			type: sql.VARCHAR,
			val: req.query.oldProject
		},
		newProject: {
			type: sql.VARCHAR,
			val: req.query.newProject
		}
	};

	sql.execute( config, {
		query: sql.fromFile("../sql/DuplicateSettings"),
		params: params
	}).then(function(results) {
		res.send(results);
	}, function(err) {
		console.log(err.message, " at duplicate settings");
		res.send({string: err.message, error: true});
	});
};