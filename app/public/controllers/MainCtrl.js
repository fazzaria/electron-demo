module.exports = function($scope, $http, $location) {
  var modals = require("./utilityFunctions/modals");

  //also change name in package.json
  $scope.adminMode = true;
  if (!$scope.adminMode) $("#pageHeader").text("mFOS Help Desk Utility");

	var screens = [
    {name: "Select a search screen", url: "/", adminOnly: false},
    {name: "Quick User Search", url: "/quickuser", modalHTML: modals.quickuser, adminOnly: false},
    {name: "User Search", url: "/user", modalHTML: modals.user, adminOnly: true},
    {name: "Token Search", url: "/token", modalHTML: modals.token, adminOnly: true},
    {name: "Log Search", url: "/log", modalHTML: modals.log, adminOnly: true},
    {name: "Location Search", url: "/location", modalHTML: modals.location, adminOnly: true},
    {name: "Mileage Search", url: "/mileage", modalHTML: modals.mileage, adminOnly: true},
    /*{name: "EROC Time Taken", url: "/eroc", modalHTML: modals.eroc, adminOnly: true},*/
    {name: "Settings", url: "/settings", modalHTML: modals.settings, adminOnly: true}/*,
    {name: "Metrics", url: "/metrics", modalHTML: modals.metrics, adminOnly: true}*/
  ];

  $scope.screens = [];

  for (var i = 0; i < screens.length; i++) {
    if ($scope.adminMode == true || screens[i].adminOnly == false) {
      $scope.screens.push(screens[i]);
    }
  }

  $scope.screen = $scope.screens[0];

  $scope.changeScreen = function() {
    $location.path($scope.screen.url);
  };

  $scope.changeInfo = function() {
    $("#infoModalText").html($scope.screen.modalHTML);
    $("#infoTitle").text($scope.screen.name + " Info");
  };

  $scope.update = function() {
    var today = Date();
    $('.input-daterange').each(function(i) {
      $(this).datepicker({
          autoclose: true,
          todayHighlight: true,
          format: "yyyy-mm-dd",
          orientation: "bottom auto",
          clearBtn: true
      });
    });
  };
};