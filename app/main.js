var electron = require('electron');
var app = require('electron').app;
var express = require("express");
var bodyParser = require("body-parser");
var xApp = express();
var BrowserWindow = electron.BrowserWindow;
var Config = require('electron-config');

var settings = new Config();

//if (!settings.store.configs) {
	console.log("initialized settings");
	settings.store = require('./connections/config.json');
//}

var runServer = function () {
	xApp.use(express.static(__dirname + "/public"));
	var distinctProjectIDSearch         = require(__dirname + "/searches/distinctProjectIDSearch.js");
	var distinctProjectIDSearchToken    = require(__dirname + "/searches/distinctProjectIDSearchToken.js");
	var distinctProjectIDSearchSettings = require(__dirname + "/searches/distinctProjectIDSearchSettings.js");
	var distinctLoggerSearch            = require(__dirname + "/searches/distinctLoggerSearch.js");
	var distinctStatusCodeSearch        = require(__dirname + "/searches/distinctStatusCodeSearch.js");
	var distinctRoleSearch              = require(__dirname + "/searches/distinctRoleSearch.js");
	var distinctUsernameSearch          = require(__dirname + "/searches/distinctUsernameSearch.js");
	var distinctUsernamesToken          = require(__dirname + "/searches/distinctUsernamesToken.js");
	var logSearch                       = require(__dirname + "/searches/logSearch.js");
	var EROCTimeTakenSearch             = require(__dirname + "/searches/EROCTimeTakenSearch.js");
	var userSearch                      = require(__dirname + "/searches/userSearch.js");
	var tokenSearch                     = require(__dirname + "/searches/tokenSearch.js");
	var trailSearch                     = require(__dirname + "/searches/trailSearch.js");
	var mileageSearch                   = require(__dirname + "/searches/mileageSearch.js");
	var getSettings                     = require(__dirname + "/searches/getSettings.js");
	var updateSettings                  = require(__dirname + "/searches/updateSettings.js");
	var insertUser                      = require(__dirname + "/searches/insertUser.js");
	var duplicateSettings               = require(__dirname + "/searches/duplicateSettings.js");
	var hubUserSearch                   = require(__dirname + "/searches/hubUserSearch.js");
	var projectUserSearch               = require(__dirname + "/searches/projectUserSearch.js");
	var authenticationTrailSearch       = require(__dirname + "/searches/authenticationTrailSearch.js");
	var metricsSearch                   = require(__dirname + "/searches/metricsSearch.js");
	var getProjects                     = require(__dirname + "/connections/getProjects.js");

	xApp.get("/distinctProjectIDs", distinctProjectIDSearch);
	xApp.get("/distinctProjectIDsToken", distinctProjectIDSearchToken);
	xApp.get("/distinctProjectIDsSettings", distinctProjectIDSearchSettings);
	xApp.get("/distinctLoggers", distinctLoggerSearch);
	xApp.get("/distinctStatusCodes", distinctStatusCodeSearch);
	xApp.get("/distinctRoles", distinctRoleSearch);
	xApp.get("/distinctUsernames", distinctUsernameSearch);
	xApp.get("/distinctUsernamesToken", distinctUsernamesToken);
	xApp.get("/tblUsers", userSearch);
	xApp.get("/tblAppLog", logSearch);
	xApp.get("/EROCTimeTakenSearch", EROCTimeTakenSearch);
	xApp.get("/AuthToken", tokenSearch);
	xApp.get("/tblLocationData", trailSearch);
	xApp.get("/tblStaffMileage", mileageSearch);
	xApp.get("/getSettings", getSettings);
	xApp.get("/updateSettings", updateSettings);
	xApp.get("/insertUser", insertUser);
	xApp.get("/duplicateSettings", duplicateSettings);
	xApp.get("/hubUserSearch", hubUserSearch);
	xApp.get("/projectUserSearch", projectUserSearch);
	xApp.get("/authenticationTrailSearch", authenticationTrailSearch);
	xApp.get("/metricsSearch", metricsSearch);
	xApp.get("/getProjects", getProjects);

	var server = xApp.listen(3000);
	console.log("Server running on port 3000.");
};

function createWindow() {
	runServer();

	var win = new BrowserWindow({width: 1100, height: 700})
	
	win.loadURL("http://localhost:3000");
	win.focus();

	win.on('closed', function() {
		win = null
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function() {
	if (win === null) {
		createWindow();
	}
});