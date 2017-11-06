var changeSort = require("./utilityFunctions/changeSort");
var formatDate = require("./utilityFunctions/formatDate");

module.exports = function($scope, $http) {
	$scope.searchText = "", $scope.messageOrException = "", $scope.levelFilter = "", $scope.minLogDate = "", $scope.maxLogDate = "", $scope.feedback = "", $scope.projectID = "ANES6PRD", $scope.logger = "", $scope.loggers = [{Logger: "Loading Loggers..."}], $scope.totalResults = 0, $scope.page = 1, $scope.perPage = "25", $scope.numberOfPages = 0, $scope.sortType = 'LogDate', $scope.sortReverse = 1, $scope.idSearch = "", $scope.idRange = "", $scope.idDirection = "";

	$http.get("/getProjects?setName=userProjects").then(function(response) {
		if (response.data.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.projectIDs = response.data;
			$scope.projectID = response.data[0];
			setTimeout($scope.changeHub, 500);
		}
	});

	$scope.changeProject = function() {
		$scope.logger = "Loading Loggers...";
		$scope.loggers = [{Logger: "Loading Loggers..."}];
		$http.get("/distinctLoggers?projectID=" + $scope.projectID).then(function(response) {
			if (response.data.error) {
				$scope.loggers = [{Logger: "An error occurred while loading loggers."}];
				$scope.logger = "An error occurred while loading loggers.";
			} else {
				$scope.loggers = response.data;
				$scope.logger = '';
			}
		});
	};
	$scope.changeProject();

	$scope.changeSort = function(prop,asc) {
		changeSort($scope, prop, asc);
		refresh();
	};

	$scope.changePage = function(sign) {
		if ($scope.page + sign <= $scope.numberOfPages && $scope.page + sign > 0) {
			$scope.page += sign;
			$scope.feedback = "Loading Next Page...";
			refresh();
		}
	};

	var refresh = function() {
		$http.get(
				"/tblAppLog?projectID=" + $scope.projectID +
				"&searchText=" + $scope.searchText +
				"&messageOrException=" + $scope.messageOrException +
				"&levelFilter=" + $scope.levelFilter +
				"&minLogDate=" + $scope.minLogDate +
				"&maxLogDate=" + $scope.maxLogDate +
				"&logger=" + $scope.logger +
				"&idSearch=" + $scope.idSearch +
				"&idRange=" + $scope.idRange +
				"&idDirection=" + $scope.idDirection +
				"&sortType=" + $scope.sortType +
				"&sortReverse=" + $scope.sortReverse +
				"&page=" + $scope.page +
				"&perPage=" + $scope.perPage
			).then(function(response) {
				if (response.data.error) {
					$scope.feedback = response.data.string;
				} else {
					$scope.totalResults = response.data.pop().TotalResults;
					for (var i = 0; i < response.data.length; i++) {
						response.data[i].LogDate = formatDate(response.data[i].LogDate);
					}
					$scope.tblAppLog = response.data;
					$scope.numberOfPages = Math.ceil($scope.totalResults / $scope.perPage);
					if ($scope.totalResults == 0) {
						$scope.feedback = "No results found.";
					} else {
						$scope.feedback = "Showing Page " + $scope.page + " of " + $scope.numberOfPages + " (" + $scope.totalResults + " results) sorted by " + $scope.sortType + " in " + ($scope.sortReverse == 0 ? "ascending " : "descending ") + "order";
					}
				}
			}
		);
	};

	$scope.search = function() {
		if (!!$scope.maxLogDate && !!$scope.minLogDate) {
			$scope.sortType = "LogDate";
			$scope.sortReverse = 0;
		}
		$scope.page = 1;
		$scope.feedback = "Searching...";
		refresh();
	};
};