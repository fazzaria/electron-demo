var changeSort = require("./utilityFunctions/changeSort");
var formatDate = require("./utilityFunctions/formatDate");

module.exports = function($scope, $http) {
	$scope.username = '', $scope.startID = "", $scope.staffID = "", $scope.minMyDay = "", $scope.maxMyDay = "", $scope.tblLocationData = "", $scope.totalResults = 0, $scope.page = 1, $scope.perPage = "10", $scope.numberOfPages = 0, $scope.feedback = "", $scope.projectID = "", $scope.sortType = 'StaffID', $scope.sortReverse = 0;

	$http.get("/getProjects?setName=userProjects").then(function(response) {
		if (response.data.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.dbs = response.data;
			$scope.database = response.data[0];
			$scope.changeDB();
		}
	});

	$scope.changeDB = function() {
		$scope.projectID = "Loading Project IDs...";
		$scope.projectIDs = [{RoleType: "Loading Project IDs..."}];
		$http.get("/distinctProjectIDs?database=mobileHub").then(function(response) {
			if (response.data.error) {
				$scope.projectIDs = [{RoleType: "An error occurred while loading project IDs."}];
				$scope.projectID = "An error occurred while loading project IDs.";
			} else {
				$scope.projectIDs = response.data;
				$scope.projectID = '';
			}
		});
	};


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
		var users = '';
		$http.get(
			"/tblUsers?database=mobileHub" +
			"&username=" + $scope.username + 
			"&projectID=" + $scope.projectID + 
			"&roleFilter=&activeFilter=&sortType=UserName&sortReverse=1&page=1&perPage=100"
		).then(function(response) {
			response.data.pop();
			if (response.data.length > 0) {
				users = response.data;
				var staffIDList = "";
				for (var i = 0; i < users.length; i++) {
					staffIDList += ("|" + users[i].BFOSRoleID);
				}
				staffIDList += "|";
				if (response.data.error) {
					$scope.feedback = response.data.string;
				} else if (response.data.length > 0) {
					var users = response.data;
					$http.get(
						"/tblLocationData?database=" + $scope.database + 
						"&staffIDList=" + staffIDList + 
						"&startID=" + $scope.startID +
						"&staffID=" + $scope.staffID +
						"&minMyDay=" + $scope.minMyDay +
						"&maxMyDay=" + $scope.maxMyDay +
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
								response.data[i].MyDayDateTimeStamp = formatDate(response.data[i].MyDayDateTimeStamp);
							}
							$scope.tblLocationData = response.data;
							$scope.numberOfPages = Math.ceil($scope.totalResults / $scope.perPage);
							if ($scope.totalResults == 0) {
								$scope.feedback = "No results found.";
							} else {
								$scope.feedback = "Showing Page " + $scope.page + " of " + $scope.numberOfPages + " (" + $scope.totalResults + " results) sorted by " + $scope.sortType + " in " + ($scope.sortReverse == 0 ? "ascending " : "descending ") + "order";
							}
						}
					});
				} else $scope.feedback = "No results found.";
			} else $scope.feedback = "No results found.";
		});
	};

	$scope.search = function() {
		if ($scope.username == "") { 
			$scope.feedback == "Username field must not be blank.";
			//return;
		}
		$scope.page = 1;
		$scope.feedback = "Searching...";
		refresh();
	};
};