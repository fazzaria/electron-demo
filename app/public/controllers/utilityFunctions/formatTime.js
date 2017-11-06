module.exports = function(milliseconds) {
	if (milliseconds != null) {
    milliseconds = parseInt(milliseconds);
    if (milliseconds > 3600000) return (milliseconds / 3600000).toPrecision(3) + " hours";
    if (milliseconds > 60000) return (milliseconds / 60000).toPrecision(3) + " minutes";
    if (milliseconds > 1000) return (milliseconds / 1000).toPrecision(3) + " seconds";
      return milliseconds + " milliseconds"
	} else {
		return milliseconds;
	}
};