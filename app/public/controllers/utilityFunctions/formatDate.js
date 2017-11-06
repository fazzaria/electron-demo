var moment = require('moment');

module.exports = function(dateString) {
	if (dateString != null) {
		return moment(dateString.slice(0,-1)).format("MM/DD/YYYY, hh:mm:ss A");
	} else {
		return dateString;
	}
};