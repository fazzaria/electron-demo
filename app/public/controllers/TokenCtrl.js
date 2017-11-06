var changeSort = require("./utilityFunctions/changeSort");
var formatDate = require("./utilityFunctions/formatDate");

module.exports = function($scope, $http) {
	$scope.username = "", $scope.totalResults = 0, $scope.page = 1, $scope.perPage = "10", $scope.numberOfPages = 0, $scope.feedback = "", $scope.sortType = 'CreatedOn', $scope.sortReverse = 1, $scope.projectIDs = [];

	$http.get("/getProjects?setName=tokenProjects").then(function(response) {
		if (response.data.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.projectIDs = response.data;
			$scope.projectID = response.data[0];
		}
	});

	$scope.changeDB = function() {
		$scope.projectID = $("#tokenDBSelect option:selected").text();
	};

	$scope.changeDB();

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
			"/AuthToken?username=" + $scope.username + 
			"&minCreatedOn=" + $scope.minCreatedOn +
			"&maxCreatedOn=" + $scope.maxCreatedOn +
			"&minExpiresOn=" + $scope.minExpiresOn +
			"&maxExpiresOn=" + $scope.maxExpiresOn +
			"&sortType=" + $scope.sortType +
			"&sortReverse=" + $scope.sortReverse +
			"&page=" + $scope.page + 
			"&perPage=" + $scope.perPage +
			"&projectID=" + $scope.projectID
		).then(function(response) {
			if (response.data.error) {
				$scope.feedback = response.data.string;
			} else {
				$scope.totalResults = response.data.pop().TotalResults;
				for (var i = 0; i < response.data.length; i++) {
					response.data[i].CreatedOn = formatDate(response.data[i].CreatedOn);
					response.data[i].ExpiresOn = formatDate(response.data[i].ExpiresOn);
				}
				$scope.AuthToken = response.data;
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
		/*if ($scope.username == "") {
			$scope.feedback = "Username field must not be blank.";
		} else {*/
			if ((!!$scope.minCreatedOn && !!$scope.maxCreatedOn) || (!!$scope.minExpiresOn && !!$scope.maxExpiresOn)) {
				$scope.sortReverse = 0;
				$scope.sortType = "CreatedOn"
			}
			$scope.page = 1;
			$scope.feedback = "Searching...";
			refresh();
		/*}*/
	};
};