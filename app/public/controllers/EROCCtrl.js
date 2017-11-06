var changeSort = require("./utilityFunctions/changeSort");
var formatTime = require("./utilityFunctions/formatTime");

module.exports = function($scope, $http) {
	$scope.minDate = "", $scope.maxDate = "", $scope.statusCode = "Loading Status Codes...", $scope.statusCodes = [{STATUSCODE: "Loading Status Codes..."}], $scope.suid = null, $scope.vActivityLog = "", $scope.totalResults = 0, $scope.page = 1, $scope.perPage = "25", $scope.numberOfPages = 0, $scope.feedback = "", $scope.projectID = "", $scope.sortType = 'SUID', $scope.sortReverse = 1;

	$http.get("/getProjects?setName=erocs").then(function(response) {
    if (response.data.error) {
      $scope.feedback = "An error occurred while loading project IDs.";
    } else {
      $scope.projectIDs = response.data;
      $scope.projectID = response.data[0];
      $scope.changeProject();
    }
  });

	$scope.changeProject = function() {
		$scope.statusCode = "Loading Status Codes...";
		$scope.statusCodes = [{STATUSCODE: "Loading Status Codes..."}];
		$http.get("/distinctStatusCodes?projectID=" + $scope.projectID).then(function(response) {
			if (response.data.error) {
				$scope.statusCodes = [{Logger: "An error occurred while loading loggers."}];
				$scope.statusCodes = "An error occurred while loading loggers.";
			} else {
				$scope.statusCodes = response.data;
				$scope.statusCode = '';
			}
		});
	};

	$scope.formatTime = formatTime;

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
			"/EROCTimeTakenSearch?projectID=" + $scope.projectID + 
			"&suid=" + ($scope.suid ? $scope.suid : -1) +
			"&statusCode=" + $scope.statusCode +
			"&minDate=" + $scope.minDate +
			"&maxDate=" + $scope.maxDate +
			"&sortType=" + $scope.sortType +
			"&sortReverse=" + $scope.sortReverse +
			"&page=" + $scope.page + 
			"&perPage=" + $scope.perPage
		).then(function(response) {
			if (response.data.error) {
				$scope.feedback = response.data.string;
			} else {
				$scope.totalResults = response.data.pop().TotalResults;
				$scope.vActivityLog = response.data;
				$scope.numberOfPages = Math.ceil($scope.totalResults / $scope.perPage);
				if ($scope.totalResults == 0) {
					$scope.feedback = "No results found.";
				} else {
					$scope.feedback = "Showing Page " + $scope.page + " of " + $scope.numberOfPages + " (" + $scope.totalResults + " results) sorted by " + $scope.sortType + " in " + ($scope.sortReverse == 0 ? "ascending " : "descending ") + "order";
				}
			}
		});
	};

	$scope.search = function() {
		$scope.page = 1;
		$scope.feedback = "Searching...";
		refresh();
	};
};