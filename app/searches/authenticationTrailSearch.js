var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var projectConfig = decideConnection(req.query.projectID);
	var demoConfig = decideConnection(req.query.projectID.slice(-3) == "PRD" ? "productionHub" : "demoHub");

	var authTrailResults = [];
	var i = 0;
	var minDate = "1980-01-01T00:00:00";
	var maxDate = "2030-01-01T23:59:59";

	//query seems not to work when username is specified; winsid is not in hub user table
	var tokenParams = {
		sortType: {
			type: sql.VARCHAR,
			val: "CreatedOn"
		},
		sortReverse: {
			type: sql.INT,
			val: 1
		},
		projectID: {
			type: sql.VARCHAR,
			val: req.query.projectID
		},
		username: {
			type: sql.VARCHAR,
			val: req.query.winsid
		},
		roleFilter: {
			type: sql.VARCHAR,
			val: ""
		},
		minCreatedOn: {
			type: sql.VARCHAR,
			val: minDate
		},
		maxCreatedOn: {
			type: sql.VARCHAR,
			val: maxDate
		},
		minExpiresOn: {
			type: sql.VARCHAR,
			val: minDate
		},
		maxExpiresOn: {
			type: sql.VARCHAR,
			val: maxDate
		},
		minRow: {
			type: sql.INT,
			val: 1
		},
		maxRow: {
			type: sql.INT,
			val: 2
		}
	};

	function getToken() {
		if (!authTrailResults[i].Message.includes("Authorization from sso success, username:")) {
			if (authTrailResults[i + 1]) {
				i++;
				getToken();
			} else {
				res.send(authTrailResults);
			}
		} else {
			var logDate1 = new Date(authTrailResults[i].LogDate);
			var logDate2 = new Date(authTrailResults[i].LogDate);
			logDate2.setMinutes(logDate2.getMinutes() + 1);

			tokenParams.minCreatedOn.val = logDate1.toISOString();
			tokenParams.maxCreatedOn.val = logDate2.toISOString();

			sql.execute( demoConfig, {
				query: sql.fromFile("../sql/SearchTokens"),
				params: tokenParams
			}).then(function(results) {
				authTrailResults[i].Token = results[0].Token ? results[0].Token : undefined;
				if (authTrailResults[i + 1]) {
					i++;
					getToken();
				} else {
					res.send(authTrailResults);
				}
			}, function(err) {
				console.log(err.message, " at search token for auth trail");
				res.send({string: err.message, error: true});
			});
		}
	}

	//one week ago
	var today = new Date();
	var minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

	var authParams = {
		winsid: {
			type: sql.VARCHAR,
			val: req.query.winsid
		},
		projectID: {
			type: sql.VARCHAR,
			val: req.query.projectID
		},
		minDate: {
			type: sql.DATETIME,
			val: minDate
		},
		maxDate: {
			type: sql.DATETIME,
			val: today
		}
	};
	
	sql.execute( projectConfig, {
		query: sql.fromFile("../sql/AuthenticationTrail"),
		params: authParams
	}).then(function(results) {
			authTrailResults = results;
			if (authTrailResults.length > 0) {
				getToken();
			} else {
				res.send(results);
			}
	}, function(err) {
		console.log(err.message, " at search logs");
		res.send({string: err.message, error: true});
	});
};