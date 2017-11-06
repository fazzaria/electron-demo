var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.database);
	var page = parseInt(req.query.page) - 1;
	var perPage = parseInt(req.query.perPage);
	var minMyDay = req.query.minMyDay;
	var maxMyDay = req.query.maxMyDay;
	if (!minMyDay) minMyDay = "1900-01-01";
	if (!maxMyDay) maxMyDay = "2100-01-01";
	minMyDay += "T00:00:00";
	maxMyDay += "T23:59:59";

	var params = {
		sortType: {
			type: sql.VARCHAR,
			val: req.query.sortType
		},
		sortReverse: {
			type: sql.INT,
			val: req.query.sortReverse
		},
		staffIDList: {
			type: sql.VARCHAR,
			val: req.query.staffIDList
		},
		startID: {
			type: sql.VARCHAR,
			val: req.query.startID
		},
		minMyDay: {
			type: sql.VARCHAR,
			val: minMyDay
		},
		maxMyDay: {
			type: sql.VARCHAR,
			val: maxMyDay
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
		query: sql.fromFile("../sql/SearchLocationData"),
		params: params
	}).then(function(results) {
		res.send(results);
	}, function(err) {
		console.log(err.message, " at search location data");
		res.send({string: err.message, error: true});
	});
};