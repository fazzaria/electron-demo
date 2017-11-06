module.exports = function (scope, prop, asc) {
	if (scope.sortType !== prop) {
		scope.sortType = prop;
	} else scope.sortReverse = (scope.sortReverse == 1 ? 0 : 1);
	scope.page = 1;
	scope.feedback = "Sorting...";
};