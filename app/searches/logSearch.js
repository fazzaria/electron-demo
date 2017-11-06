var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.projectID);
	var page = parseInt(req.query.page) - 1;
	var sortReverse = parseInt(req.query.sortReverse);
	var perPage = parseInt(req.query.perPage);

	var minLogDate = req.query.minLogDate;
	var maxLogDate = req.query.maxLogDate;
	if (!minLogDate) {
		minLogDate = "1980-01-01";
	}
	if (!maxLogDate) {
		maxLogDate = "2030-12-31";
	}
	minLogDate += "T00:00:00";
	maxLogDate += "T23:59:59";

	var idDirection = req.query.idDirection;
	var idSearch = (req.query.idSearch == '' || req.query.idSearch == "null") ? -1 : parseInt(req.query.idSearch);
	var idRange = ((req.query.idRange == '' || req.query.idRange == "null") || idSearch == -1) ? 0 : parseInt(req.query.idRange);
	var idMin = -1;
	var idMax = -1;

	if (idSearch != -1) {
		if (idDirection) {
			if (idDirection == "after") {
				idMin = idSearch;
				idMax = idSearch + idRange;
			} else if (idDirection == "before") {
				idMax = idSearch;
				idMin = idSearch - idRange;
			}
		} else {
			idMin = idSearch - idRange;
			idMax = idSearch + idRange;
		}
	}
	
	var params = {
		searchText: {
			type: sql.VARCHAR,
			val: req.query.searchText
		},
		sortType: {
			type: sql.VARCHAR,
			val: req.query.sortType
		},
		sortReverse: {
			type: sql.VARCHAR,
			val: sortReverse
		},
		minLogDate: {
			type: sql.VARCHAR,
			val: minLogDate
		},
		maxLogDate: {
			type: sql.VARCHAR,
			val: maxLogDate
		},
		levelFilter: {
			type: sql.VARCHAR,
			val: req.query.levelFilter
		},
		messageOrException: {
			type: sql.VARCHAR,
			val: req.query.messageOrException
		},
		loggerFilter: {
			type: sql.VARCHAR,
			val: req.query.logger.replace(" ","+")
		},
		idMin: {
			type: sql.INT,
			val: idMin
		},
		idMax: {
			type: sql.INT,
			val: idMax
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
			query: sql.fromFile("../sql/SearchLogs"),
			params: params
	}).then(function(results) {
			res.send(results);
	}, function(err) {
		console.log(err.message, " at search logs");
		res.send({string: err.message, error: true});
	});
};