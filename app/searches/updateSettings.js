var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection("demoHub");
	
	var params = {
		id: {
			type: sql.VARCHAR,
			val: req.query.id
		},
		val: {
			type: sql.VARCHAR,
			val: req.query.val
		}
	};

	sql.execute( config, {
		query: sql.fromFile("../sql/UpdateAppSettings"),
		params: params
	}).then(function(results) {
		res.send(results);
	}, function(err) {
		console.log(err.message, " at update app settings");
		res.send({string: err.message, error: true});
	});
};