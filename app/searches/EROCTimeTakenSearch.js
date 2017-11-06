var sql = require("seriate");

module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.projectID);
	var page = parseInt(req.query.page) - 1;
	var sortReverse = parseInt(req.query.sortReverse);
	var perPage = parseInt(req.query.perPage);

	var minDate = req.query.minDate;
	var maxDate = req.query.maxDate;
	if (!minDate) {
		minDate = "1980-01-01";
	}
	if (!maxDate) {
		maxDate = "2030-12-31";
	}
	minDate += "T00:00:00";
	maxDate += "T23:59:59";
	
	var params = {
		sortType: {
			type: sql.VARCHAR,
			val: req.query.sortType
		},
		sortReverse: {
			type: sql.VARCHAR,
			val: sortReverse
		},
		minDate: {
			type: sql.VARCHAR,
			val: minDate
		},
		maxDate: {
			type: sql.VARCHAR,
			val: maxDate
		},
		suid: {
			type: sql.INT,
			val: req.query.suid
		},
		statusCode: {
			type: sql.VARCHAR,
			val: req.query.statusCode
		},
		minRow: {
			type: sql.INT,
			val: (page * perPage)
		},
		maxRow: {
			type: sql.INT,
			val: (page * perPage + perPage)
		},
	};
	
	sql.execute( config, {
			query: sql.fromFile("../sql/EROCTimeTaken"),
			params: params
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at search eroc time taken");
		res.send({string: err.message, error: true});
	});
};