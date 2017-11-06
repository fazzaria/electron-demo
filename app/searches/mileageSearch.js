var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.database);
	var page = parseInt(req.query.page) - 1;
	var perPage = parseInt(req.query.perPage);

	var minRecordedOn = req.query.minRecordedOn;
	var maxRecordedOn = req.query.maxRecordedOn;
	if (!minRecordedOn) minRecordedOn = "1980-01-01";
	if (!maxRecordedOn) maxRecordedOn = "2030-01-01";
	minRecordedOn += "T00:00:00";
	maxRecordedOn += "T23:59:59";

	var minCreatedDt = req.query.minCreatedDt;
	var maxCreatedDt = req.query.maxCreatedDt;
	if (!minCreatedDt) minCreatedDt = "1980-01-01";
	if (!maxCreatedDt) maxCreatedDt = "2030-01-01";
	minCreatedDt += "T00:00:00";
	maxCreatedDt += "T23:59:59";

	var params = {
		minRecordedOn: {
			type: sql.VARCHAR,
			val: minRecordedOn
		},
		maxRecordedOn: {
			type: sql.VARCHAR,
			val: maxRecordedOn
		},
		minCreatedDt: {
			type: sql.VARCHAR,
			val: minCreatedDt
		},
		maxCreatedDt: {
			type: sql.VARCHAR,
			val: maxCreatedDt
		},
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
		minRow: {
			type: sql.INT,
			val: (page * perPage)
		},
		maxRow: {
			type: sql.INT,
			val: (page * perPage + perPage)
		},
	};
	var resultCount = 0;
	function setResultCount(num) {
		if (num[0]['']) {
			resultCount = num[0][''];
		}
	}
	sql.execute( config, {
		query: sql.fromFile("../sql/SearchMileage"),
		params: params
	}).then(function(results) {
		function reformatDate(date) {
			return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
		}
		var days = [];
		var totalResults = results.pop();
		for (var i = 0; i < results.length; i++) {
			var day = reformatDate(results[i].RecordedOn);
			if (days.indexOf(day) == -1) {
				days.push(day);
			};
		}
		var maxDates = [];
		var timeFilteredResults = [];
		for (var j = 0; j < days.length; j++) {
			var recordsFromDay = [];
			for (var k = 0; k < results.length; k++) {
				if (Date.parse(reformatDate(results[k].RecordedOn)) == Date.parse(days[j])) {
					recordsFromDay.push(results[k]);
				}
			}
			var maxDate = "1980-01-01T00:00:00.000Z";
			var maxTimeRecord = {};
			for (var l = 0; l < recordsFromDay.length; l++) {
				if (Date.parse(reformatDate(recordsFromDay[l].RecordedOn)) > Date.parse(maxDate)) {
					maxDate = recordsFromDay[l].RecordedOn;
					maxTimeRecord = recordsFromDay[l];
				}
			}
			timeFilteredResults.push(maxTimeRecord);
		}
		if (req.query.sortType == "RecordedOn" || req.query.sortType == "CreatedDt") {
			if (req.query.sortReverse == "1") {
				timeFilteredResults.sort(function(a,b) {
					var a = parseInt(Date.parse(reformatDate(a[req.query.sortType])));
					var b = parseInt(Date.parse(reformatDate(b[req.query.sortType])));
					if (a < b) return -1;
					if (b < a) return 1;
					return 0;
				});
			} else if (req.query.sortReverse == "0") {
				timeFilteredResults.sort(function(a,b) {
					var a = parseInt(Date.parse(reformatDate(a[req.query.sortType])));
					var b = parseInt(Date.parse(reformatDate(b[req.query.sortType])));
					if (b < a) return -1;
					if (a < b) return 1;
					return 0;
				});
			}
		} else {
			if (req.query.sortReverse == "1") {
				timeFilteredResults.sort(function(a,b) {
					var a = a[req.query.sortType];
					var b = b[req.query.sortType];
					if (a < b) return -1;
					if (b < a) return 1;
					return 0;
				});
			} else if (req.query.sortReverse == "0") {
				timeFilteredResults.sort(function(a,b) {
					var a = a[req.query.sortType];
					var b = b[req.query.sortType];
					if (b < a) return -1;
					if (a < b) return 1;
					return 0;
				});
			}
		}
		var totes = {TotalResults: timeFilteredResults.length};
		timeFilteredResults = timeFilteredResults.slice(page * perPage, page * perPage + perPage);
		timeFilteredResults.push(totes);
		res.send(timeFilteredResults);
	}, function(err) {
		console.log(err.message, " at search mileage");
		res.send({string: err.message, error: true});
	});
};