var changeSort = require("./utilityFunctions/changeSort");
var formatDate = require("./utilityFunctions/formatDate");

module.exports = function($scope, $http) {
	$scope.username = '', $scope.activeFilter = '', $scope.roleFilter = 'Loading Roles...', $scope.roles = [{RoleType: "Loading Roles..."}], $scope.dbs = [{display: "Demo Hub", name: "demoHub"}, {display: "Production Hub", name: "productionHub"}], $scope.projectIDs = [], $scope.totalResults = 0, $scope.page = 1, $scope.perPage = "10", $scope.numberOfPages = 0, $scope.feedback = "", $scope.sortType = 'UserName', $scope.sortReverse = 0;

	$scope.database = $scope.dbs[0].name;

	$scope.changeProject = function() {
		$scope.roleFilter = "Loading Roles...";
		$scope.roles = [{RoleType: "Loading Roles..."}];
		$http.get("/distinctRoles?database=" + $scope.database + "&projectID=" + $scope.projectID).then(function(response) {
			if (response.data.error) {
				$scope.feedback = "An error occurred while loading roles.";
			} else {
				$scope.roles = response.data;
				$scope.roleFilter = '';
			}
		});
	};

	$http.get("/getProjects?setName=userProjects").then(function(response) {
		if (response.data.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.projectIDs = response.data;
			$scope.projectID = '';
		}
	});

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
			"/tblUsers?username=" + $scope.username + 
			"&roleFilter=" + $scope.roleFilter +
			"&activeFilter=" + $scope.activeFilter +
			"&sortType=" + $scope.sortType +
			"&sortReverse=" + $scope.sortReverse +
			"&page=" + $scope.page + 
			"&perPage=" + $scope.perPage +
			"&projectID=" + $scope.projectID +
			"&database=" + $scope.database
		).then(function(response) {
			if (response.data.error) {
				$scope.feedback = response.data.string;
			} else {
				$scope.totalResults = response.data.pop().TotalResults;
				$scope.tblUsers = response.data;
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

	/*$scope.addUser = function() {
		$http.get(
			"/insertUser?username=" + $scope.iUsername + 
			"&pwd=" + $scope.iPwd +
			"&projectID=" + $scope.iProject +
			"&roleID=" + $scope.iRole +
			"&active=" + $scope.iActive
		).then(function(response) {
			if (response.error) {
				$scope.feedback = response.string;
			} else {
				$("#closeAddUser").click();
				$scope.feedback = "User added successfully.";
			}
		});
	};*/
};