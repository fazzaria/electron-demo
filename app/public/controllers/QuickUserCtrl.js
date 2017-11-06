var changeSort = require("./utilityFunctions/changeSort");
var formatDate = require("./utilityFunctions/formatDate");

module.exports = function($scope, $http) {
	$scope.winsid = '', $scope.feedback = "", $scope.logFeedback = "", $scope.roleFeedback = "", $scope.db = "demoHub", $scope.tblUsers = [], $scope.tblAppLog = [], $scope.tblRole = [], $scope.projectIDs = [], $scope.iProjectID = "";

	$http.get("/getProjects?setName=userProjects").then(function(response) {
		if (response.data.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.projectIDs = response.data;
			$scope.projectID = response.data[0];
		}
	});
	//1708109
	function trailSearch() {
		$scope.logFeedback = "Searching...";
		$http.get(
			"/authenticationTrailSearch?winsid=" + $scope.winsid +
			"&projectID=" + $scope.projectID
		).then(function(response) {
			if (response.data.error) {
				$scope.logFeedback = response.data.string;
			} else {
				//$scope.lastTokenDate = response.data.pop().CreatedOn;
				for (var i = 0; i < response.data.length; i++) {
					response.data[i].LogDate = formatDate(response.data[i].LogDate);
				}
				$scope.tblAppLog = response.data;
				if (response.data.length == 0) {
					$scope.logFeedback = "No results found.";
					if ($scope.lastTokenDate) {
						//$scope.logFeedback += " Last login for this user: " + formatDate($scope.lastTokenDate);
					}
				} else {
					$scope.logFeedback = "Showing entries from past week.";
					if ($scope.lastTokenDate) {
						//$scope.logFeedback += " Last login for this user: " + formatDate($scope.lastTokenDate);
					}
				}
			}
		});
	}

	function projectSearch() {
		$scope.roleFeedback = "Searching...";
		$http.get(
			"/projectUserSearch?winsid=" + $scope.winsid + "&projectID=" + $scope.projectID
		).then(function(response) {
			if (response.data.error) {
				$scope.roleFeedback = response.data.string;
			} else {
				for (var i = 0; i < response.data.length; i++) {
					response.data[i].CREATEDT = formatDate(response.data[i].CREATEDT);
				}
				$scope.tblRole = response.data;
				if (response.data.length == 0) {
					$scope.roleFeedback = "No results found.";
				} else {
					$scope.roleFeedback = "Showing " + response.data.length + " entries.";
				}
			}
		})
	};

	function hubSearch() {
		$http.get(
			"/hubUserSearch?winsid=" + $scope.winsid + "&projectID=" + $scope.projectID
		).then(function(response) {
			if (response.data.error) {
				$scope.feedback = response.data.string;
			} else {
				$scope.tblUsers = response.data;
				if (response.data.length == 0) {
					$scope.feedback = "No results found.";
				} else {
					$scope.feedback = "Showing " + response.data.length + " entries.";
				}
			}
		});
	}

	var refresh = function() {
		$scope.iProjectID = $scope.projectID;
		hubSearch();
		trailSearch();
		projectSearch();
	};
	
	$scope.search = function() {
		if ($scope.winsid != "") {
			$scope.feedback = "Searching...";
			refresh();
		} else {
			$scope.feedback = "Please enter a WINSID.";
			$scope.logFeedback = "Please enter a WINSID.";
			$scope.roleFeedback = "Please enter a WINSID.";
		}
	};

	$scope.addUser = function(userInfo) {
		userInfo.ProjectID = $scope.iProjectID;
		$scope.feedback = "Adding user...";
		console.log(userInfo);
		$http.get("/insertUser", {params: userInfo}).then(function(response) {
			if (response.data.error) {
				$scope.feedback = response.data.string;
			} else {
				$scope.feedback = "User added successfully.";
			}
		});
	};
};