var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.projectID);

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
		minDate: {
			type: sql.VARCHAR,
			val: minDate
		},
		maxDate: {
			type: sql.VARCHAR,
			val: maxDate
		}
	};

	var queries = [
		{
			text: "SELECT COUNT(*) AS Value, Name = @name FROM tblAppLog WHERE LogDate BETWEEN @minDate AND @maxDate",
			name: 'Log Count'
		},
		{
			text: "SELECT COUNT(*) AS Value, Name = @name FROM tblStaffMileage WHERE RecordedOn BETWEEN @minDate AND @maxDate",
			name: 'Mileage Entries'
		},
		{
			text: "SELECT COUNT(*) AS Value, Name = @name FROM vActivityLog WHERE CREATEDT BETWEEN @minDate AND @maxDate AND STATUSSOURCEID = 'E'",
			name: 'EROC Count'
		},
		{
			text: "SELECT COUNT(*) AS Value, Name = @name FROM tblLocationData WHERE MyDayDateTimeStamp BETWEEN @minDate AND @maxDate",
			name: 'Location Points'
		}
	];
	
	var results = [];

	var search = function(query) {
		params.name = query.name;
		sql.execute( config, {
			query: query.text,
			params: params
		}).then(function(tempResults) {
			results.push(tempResults[0]);
			if (queries.length > 0) {
				search(queries.pop());
			} else {
				res.send(results);
			}
		}, function(err) {
			console.log(err.message, " at search metrics");
			results.push({Name: params.name, Value: err.message});
			if (queries.length > 0) {
				search(queries.pop());
			} else {
				res.send(results);
			}
		});
	}

	search(queries.pop());
};