var Config = require('electron-config');

var decideConnection = function(projectName) {

	var config = new Config();

	var allConfigs = config.store.configs;
	var logConfig = {};

	if (projectName) {
		if (projectName == "All of them") {
			return allConfigs;
		} else {
			for (var i = 0; i < allConfigs.length; i++) {
				if (projectName == allConfigs[i].name) {
					return allConfigs[i];
				}
			}
		}
	} else return { error: true };
};

module.exports = decideConnection;