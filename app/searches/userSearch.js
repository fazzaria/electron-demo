var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.database);
	var page = parseInt(req.query.page) - 1;
	var perPage = parseInt(req.query.perPage);

	var params = {
		sortType: {
			type: sql.VARCHAR,
			val: req.query.sortType
		},
		sortReverse: {
			type: sql.INT,
			val: req.query.sortReverse
		},
		projectID: {
			type: sql.VARCHAR,
			val: req.query.projectID
		},
		username: {
			type: sql.VARCHAR,
			val: req.query.username
		},
		roleFilter: {
			type: sql.VARCHAR,
			val: req.query.roleFilter
		},
		activeFilter: {
			type: sql.CHAR,
			val: req.query.activeFilter
		},
		minRow: {
			type: sql.INT,
			val: (page * perPage)
		},
		maxRow: {
			type: sql.INT,
			val: (page * perPage + perPage)
		}
	};

	sql.execute( config, {
		query: sql.fromFile("../sql/SearchUsers"),
		params: params
	}).then(function(results) {
		res.send(results);
	}, function(err) {
		console.log(err.message, " at search users");
		res.send({string: err.message, error: true});
	});
};