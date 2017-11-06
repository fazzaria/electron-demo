var angular = require('angular');
var angularRoute = require('angular-route');

//angular controllers
var myApp = angular.module('myApp', [angularRoute]);

myApp.controller('MainCtrl', ['$scope', '$http', '$location', require('./public/controllers/MainCtrl')]);
myApp.controller('LocationCtrl', ['$scope', '$http', require('./public/controllers/LocationCtrl')]);
myApp.controller('LogCtrl', ['$scope', '$http', require('./public/controllers/LogCtrl')]);
myApp.controller('MileageCtrl', ['$scope', '$http', require('./public/controllers/MileageCtrl')]);
myApp.controller('QuickUserCtrl', ['$scope', '$http', require('./public/controllers/QuickUserCtrl')]);
myApp.controller('SettingsCtrl', ['$scope', '$http', require('./public/controllers/SettingsCtrl')]);
myApp.controller('TokenCtrl', ['$scope', '$http', require('./public/controllers/TokenCtrl')]);
myApp.controller('UserCtrl', ['$scope', '$http', require('./public/controllers/UserCtrl')]);
myApp.controller('EROCCtrl', ['$scope', '$http', require('./public/controllers/EROCCtrl')]);
myApp.controller('MetricsCtrl', ['$scope', '$http', require('./public/controllers/MetricsCtrl')]);

myApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/quickuser", {
        templateUrl: "../views/quickuser.html",
        controller: "QuickUserCtrl"
    })
    .when("/user", {
        templateUrl : "../views/user.html",
        controller: "UserCtrl"
    })
    .when("/token", {
        templateUrl : "../views/token.html",
        controller: "TokenCtrl"
    })
    .when("/log", {
        templateUrl : "../views/log.html",
        controller: "LogCtrl"
    })
    .when("/location", {
        templateUrl : "../views/location.html",
        controller: "LocationCtrl"
    })
    .when("/mileage", {
        templateUrl : "../views/mileage.html",
        controller: "MileageCtrl"
    })
    .when("/eroc", {
        templateUrl : "../views/eroc.html",
        controller: "EROCCtrl"
    })
    .when("/metrics", {
        templateUrl : "../views/metrics.html",
        controller: "MetricsCtrl"
    })
    .when("/settings", {
        templateUrl : "../views/settings.html",
        controller: "SettingsCtrl"
    });
  $locationProvider.html5Mode(true);
});