module.exports = function($scope, $http) {
  $scope.minDate = "", $scope.maxDate = "", $scope.feedback = "", $scope.projectID = "", $scope.logger = "", $scope.buttonDisable = false;

  $http.get("/getProjects?setName=metricsProjects").then(function(response) {
    if (response.data.error) {
      $scope.feedback = "An error occurred while loading project IDs.";
    } else {
      $scope.projectIDs = response.data;
      $scope.projectID = response.data[0];
    }
  });

  var refresh = function() {
    $http.get(
        "/metricsSearch?projectID=" + $scope.projectID +
        "&minDate=" + $scope.minDate +
        "&maxDate=" + $scope.maxDate
      ).then(function(response) {
        $("#metricSearch").attr("disabled", false);
        if (response.data.error) {
          $scope.feedback = response.data.string;
        } else {
          $scope.feedback = "";
          $scope.metrics = response.data;
        }
      }
    );
  };

  $scope.search = function() {
    $("#metricSearch").attr("disabled", true);
    $scope.feedback = "Searching...";
    refresh();
  };
};