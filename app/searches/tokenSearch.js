var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var config = decideConnection(req.query.projectID.slice(-3) == "PRD" ? "productionHub" : "demoHub");

	var page = parseInt(req.query.page) - 1;
	var perPage = parseInt(req.query.perPage);
	
	var minCreatedOn = req.query.minCreatedOn;
	var maxCreatedOn = req.query.maxCreatedOn;
	var minExpiresOn = req.query.minExpiresOn;
	var maxExpiresOn = req.query.maxExpiresOn;

	//Request is in string form
	if (minCreatedOn == "undefined" || minCreatedOn == "") {
		minCreatedOn = "1980-01-01";
	}
	if (maxCreatedOn == "undefined" || maxCreatedOn == "") {
		maxCreatedOn = "2030-01-01";
	}
	if (minExpiresOn == "undefined" || minExpiresOn == "") {
		minExpiresOn = "1980-01-01";
	}
	if (maxExpiresOn == "undefined" || maxExpiresOn == "") {
		maxExpiresOn = "2030-01-01";
	}

	minCreatedOn += "T00:00:00";
	maxCreatedOn += "T23:59:59";
	minExpiresOn += "T00:00:00";
	maxExpiresOn += "T23:59:59";

	var username = "";
	if (req.query.username == "") {
		username = "undefined";
	} else {
		username = req.query.username;
	}
	
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
			val: username
		},
		roleFilter: {
			type: sql.VARCHAR,
			val: req.query.roleFilter
		},
		minCreatedOn: {
			type: sql.VARCHAR,
			val: minCreatedOn
		},
		maxCreatedOn: {
			type: sql.VARCHAR,
			val: maxCreatedOn
		},
		minExpiresOn: {
			type: sql.VARCHAR,
			val: minExpiresOn
		},
		maxExpiresOn: {
			type: sql.VARCHAR,
			val: maxExpiresOn
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
		query: sql.fromFile("../sql/SearchTokens"),
		params: params
	}).then(function(results) {
		res.send(results);
	}, function(err) {
		console.log(err.message, " at search token");
		res.send({string: err.message, error: true});
	});
};