var changeSort = require("./utilityFunctions/changeSort");
var formatDate = require("./utilityFunctions/formatDate");

module.exports = function($scope, $http) {
	$scope.feedback = "", $scope.projectIDs = [{ProjectID: "Loading Projects..."}], $scope.projectID = "Loading Projects...", $scope.settings = [];

	$scope.changeProject = function() {
		$scope.feedback = "Loading settings...";
		$http.get("/getSettings?projectID=" + $scope.projectID).then(function(response) {
				if (response.data.error) {
					$scope.feedback = "An error occurred while loading settings.";
					$scope.settings = [];
				} else {
					$("#duplicateSettingsButton").show();
					$scope.feedback = "Showing settings for " + $scope.projectID + ".";
					$scope.settings = response.data;
				}
			}
		);
	};

	function getDistinctProjects() {
		$http.get("/distinctProjectIDsSettings").then(function(response) {
				if (response.data.error) {
					$scope.projectIDs = [{ProjectID: "An error occurred while loading project IDs."}];
					$scope.projectID = "An error occurred while loading project IDs.";
				} else {
					$scope.projectIDs = response.data;
					$scope.projectID = $scope.projectIDs[0];
				}
			}
		);
	}
	
	getDistinctProjects();

	$scope.saveChange = function(id) {
		$http.get(
			"/updateSettings?id=" + id +
			"&val=" + $("#field" + id).val()
		).then(function(response) {
			if (response.data.error) {
				$scope.feedback = response.data.string;
			} else {
				alert("Setting successfully updated.");
			}
		});
	};

	$scope.duplicateSettings = function() {
		$http.get(
			"/duplicateSettings?oldProject=" + $scope.projectID + 
			"&newProject=" + $scope.iProjectID
		).then(function(response) {
			if (response.data.error) {
				$scope.feedback = response.data.string;
			} else {
				$("#closeDuplicateSettings").click();
				$scope.feedback = "Settings duplicated successfully.";
				getDistinctProjects();
			}
		});
	};
};