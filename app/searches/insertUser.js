var sql = require("seriate");
module.exports = function(req,res) {
	var decideConnection = require("../connections/decideConnection");
	var demoConfig = decideConnection("demoHub");
	var projectConfig = decideConnection(req.query.ProjectID);

	//placeholder
	var pwd = "MK2kXFhVgrWREP+EjcExW58xSEDYw83I7ZTV1KLTWq8=";

/*	sql.execute( demoConfig, {
		query: sql.fromFile("../sql/GetPwd"),
		params: {id: {
			type: sql.VARCHAR,
			val: req.query.LOGINID
		}}
	}).then(function(results) {
		console.log("results: ", results);*/
		var params = {
			ActiveYN: {
				type: sql.VARCHAR,
				val: "Y"
			},
			BFOSRoleID: {
				type: sql.VARCHAR,
				val: req.query.ROLEID
			},
			ProjectID: {
				type: sql.VARCHAR,
				val: req.query.ProjectID
			},
			Pwd: {
				type: sql.VARCHAR,
				val: pwd
			},
			RoleType: {
				type: sql.VARCHAR,
				val: "Interviewer"
			},
			UserName: {
				type: sql.VARCHAR,
				val: req.query.LOGINID
			}
		};
		sql.execute( demoConfig, {
			query: sql.fromFile("../sql/InsertUser"),
			params: params
		}).then(function(results) {
			res.send(results);
		}, function(err) {
			console.log(err.message, " at insert user");
			res.send({string: err.message, error: true});
		});
	/*}, function(err) {
		console.log(err.message, " at get pwd");
		res.send({string: err.message, error: true});
	});*/
};