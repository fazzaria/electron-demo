var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var userResults = [];

	var configNames = [];
	configNames.push(req.query.projectID)

	var params = {
		winsid: {
			type: sql.VARCHAR,
			val: req.query.winsid
		}
	};

	var i = 0;

	function addResults(config) {
		sql.execute( config, {
			query: sql.fromFile("../sql/QuickSearchUsersInProject"),
			params: params
		}).then(function(results) {
				for (var j = 0; j < results.length; j++) {
					userResults.push(results[j]);
				}
				i++;
				if (configNames[i] != undefined) {
					var newConfig = decideConnection(configNames[i]);
					addResults(newConfig);
				} else {
					res.send(userResults);
				}
			}, function(err) {
				console.log(err.message, " at quick project user search");
				res.send({string: err.message, error: true});
			});
	}

	addResults(decideConnection(configNames[0]));
};