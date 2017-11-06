var myApp = angular.module('myApp', []);

function changeSort(scope, prop, asc) {
	if (scope.sortType !== prop) {
		scope.sortType = prop;
	} else scope.sortReverse = (scope.sortReverse == 1 ? 0 : 1);
	scope.page = 1;
	scope.feedback = "Sorting...";
}

myApp.controller('QuickUserCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.winsid = '', $scope.feedback = "", $scope.logFeedback = "", $scope.roleFeedback = "", $scope.db = "demoHub", $scope.tblUsers = [], $scope.tblAppLog = [], $scope.tblRole = [], $scope.projectIDs = [], $scope.iProjectID = "";

	$http.get("/getProjects?setName=userProjects").success(function(response) {
		if (response.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.projectIDs = response;
			$scope.projectID = response[0];
		}
	});

	function formatDate(dateString) {
		if (dateString != null) {
			var dt = new Date(dateString);
			//convert to 12 hour time
			dt = dt.toLocaleString('en-US');
			return dt;
		} else {
			return dateString;
		}
	}

	function trailSearch() {
		$scope.logFeedback = "Searching...";
		$http.get(
			"/authenticationTrailSearch?winsid=" + $scope.winsid +
			"&projectID=" + $scope.projectID
		).success(function(response) {
			if (response.error) {
				$scope.logFeedback = response.string;
			} else {
				//$scope.lastTokenDate = response.pop().CreatedOn;
				for (var i = 0; i < response.length; i++) {
					response[i].LogDate = formatDate(response[i].LogDate);
				}
				$scope.tblAppLog = response;
				if (response.length == 0) {
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
		).success(function(response) {
			if (response.error) {
				$scope.roleFeedback = response.string;
			} else {
				for (var i = 0; i < response.length; i++) {
					response[i].CREATEDT = formatDate(response[i].CREATEDT);
				}
				$scope.tblRole = response;
				if (response.length == 0) {
					$scope.roleFeedback = "No results found.";
				} else {
					$scope.roleFeedback = "Showing " + response.length + " entries.";
				}
			}
		})
	};

	function hubSearch() {
		$http.get(
			"/hubUserSearch?winsid=" + $scope.winsid + "&projectID=" + $scope.projectID
		).success(function(response) {
			if (response.error) {
				$scope.feedback = response.string;
			} else {
				$scope.tblUsers = response;
				if (response.length == 0) {
					$scope.feedback = "No results found.";
				} else {
					$scope.feedback = "Showing " + response.length + " entries.";
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
		$http.get("/insertUser", {params: userInfo}).success(function(response) {
			if (response.error) {
				$scope.feedback = response.string;
			} else {
				$scope.feedback = "User added successfully.";
			}
		});
	};
}]);

myApp.controller('UserCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.username = '', $scope.activeFilter = '', $scope.roleFilter = 'Loading Roles...', $scope.roles = [{RoleType: "Loading Roles..."}], $scope.dbs = [{display: "Demo Hub", name: "demoHub"}, {display: "Production Hub", name: "productionHub"}], $scope.projectIDs = [], $scope.totalResults = 0, $scope.page = 1, $scope.perPage = 10, $scope.numberOfPages = 0, $scope.feedback = "", $scope.sortType = 'UserName', $scope.sortReverse = 0;

	$scope.database = $scope.dbs[0].name;

	$scope.changeProject = function() {
		$scope.roleFilter = "Loading Roles...";
		$scope.roles = [{RoleType: "Loading Roles..."}];
		$http.get("/distinctRoles?database=" + $scope.database + "&projectID=" + $scope.projectID).success(function(response) {
			if (response.error) {
				$scope.feedback = "An error occurred while loading roles.";
			} else {
				$scope.roles = response;
				$scope.roleFilter = '';
			}
		});
	};

	$http.get("/getProjects?setName=userProjects").success(function(response) {
		if (response.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.projectIDs = response;
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
		).success(function(response) {
			if (response.error) {
				$scope.feedback = response.string;
			} else {
				$scope.totalResults = response.pop().TotalResults;
				$scope.tblUsers = response;
				$scope.numberOfPages = Math.ceil($scope.totalResults / $scope.perPage);
				if ($scope.totalResults == 0) {
					$scope.feedback = "No results found.";
				} else {
					$scope.feedback = "Showing Page " + $scope.page + " of " + $scope.numberOfPages + ", Sorted by " + $scope.sortType + " in " + ($scope.sortReverse == 0 ? "Ascending " : "Descending ") + "Order";
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
		).success(function(response) {
			if (response.error) {
				$scope.feedback = response.string;
			} else {
				$("#closeAddUser").click();
				$scope.feedback = "User added successfully.";
			}
		});
	};*/
}]);

myApp.controller('LogCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.searchText = "", $scope.messageOrException = "", $scope.levelFilter = "", $scope.minLogDate = "", $scope.maxLogDate = "", $scope.feedback = "", $scope.projectID = "ANES6PRD", $scope.logger = "", $scope.loggers = [{Logger: "Loading Loggers..."}], $scope.totalResults = 0, $scope.page = 1, $scope.perPage = 25, $scope.numberOfPages = 0, $scope.sortType = 'LogDate', $scope.sortReverse = 1, $scope.idSearch = "", $scope.idRange = "", $scope.idDirection = "";

	$http.get("/getProjects?setName=userProjects").success(function(response) {
		if (response.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.projectIDs = response;
			$scope.projectID = response[0];
			setTimeout($scope.changeHub, 500);
		}
	});

	$scope.changeProject = function() {
		$scope.logger = "Loading Loggers...";
		$scope.loggers = [{Logger: "Loading Loggers..."}];
		$http.get("/distinctLoggers?projectID=" + $scope.projectID).success(function(response) {
			if (response.error) {
				$scope.loggers = [{Logger: "An error occurred while loading loggers."}];
				$scope.logger = "An error occurred while loading loggers.";
			} else {
				$scope.loggers = response;
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
			).success(function(response) {
				if (response.error) {
					$scope.feedback = response.string;
				} else {
					$scope.totalResults = response.pop().TotalResults;
					for (var i = 0; i < response.length; i++) {
						var dt = new Date(response[i].LogDate);
						dt = dt.toUTCString();
						dt = dt.slice(5,-3);
						response[i].LogDate = dt;
					}
					$scope.tblAppLog = response;
					$scope.numberOfPages = Math.ceil($scope.totalResults / $scope.perPage);
					if ($scope.totalResults == 0) {
						$scope.feedback = "No results found.";
					} else {
						$scope.feedback = "Showing Page " + $scope.page + " of " + $scope.numberOfPages + ", Sorted by " + $scope.sortType + " in " + ($scope.sortReverse == 0 ? "Ascending " : "Descending ") + "Order";
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
}]);

myApp.controller('TokenCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.username = "", $scope.totalResults = 0, $scope.page = 1, $scope.perPage = 10, $scope.numberOfPages = 0, $scope.feedback = "", $scope.sortType = 'CreatedOn', $scope.sortReverse = 1, $scope.projectIDs = [];

	$http.get("/getProjects?setName=tokenProjects").success(function(response) {
		if (response.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.projectIDs = response;
			$scope.projectID = response[0];
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
		).success(function(response) {
			if (response.error) {
				$scope.feedback = response.string;
			} else {
				$scope.totalResults = response.pop().TotalResults;
				for (var i = 0; i < response.length; i++) {
					var co = new Date(response[i].CreatedOn);
					var eo = new Date(response[i].ExpiresOn);
					co = co.toUTCString();
					eo = eo.toUTCString();
					co = co.slice(5,-3);
					eo = eo.slice(5,-3);
					response[i].CreatedOn = co;
					response[i].ExpiresOn = eo;
				}
				$scope.AuthToken = response;
				$scope.numberOfPages = Math.ceil($scope.totalResults / $scope.perPage);
				if ($scope.totalResults == 0) {
					$scope.feedback = "No results found.";
				} else {
					$scope.feedback = "Showing Page " + $scope.page + " of " + $scope.numberOfPages + ", Sorted by " + $scope.sortType + " in " + ($scope.sortReverse == 0 ? "Ascending " : "Descending ") + "Order";
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
}]);

myApp.controller('LocationCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.username = '', $scope.startID = "", $scope.staffID = "", $scope.minMyDay = "", $scope.maxMyDay = "", $scope.tblLocationData = "", $scope.totalResults = 0, $scope.page = 1, $scope.perPage = 10, $scope.numberOfPages = 0, $scope.feedback = "", $scope.projectID = "", $scope.sortType = 'StaffID', $scope.sortReverse = 0;

	$http.get("/getProjects?setName=userProjects").success(function(response) {
		if (response.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.dbs = response;
			$scope.database = response[0];
			$scope.changeDB();
		}
	});

	$scope.changeDB = function() {
		$scope.projectID = "Loading Project IDs...";
		$scope.projectIDs = [{RoleType: "Loading Project IDs..."}];
		$http.get("/distinctProjectIDs?database=mobileHub").success(function(response) {
			if (response.error) {
				$scope.projectIDs = [{RoleType: "An error occurred while loading project IDs."}];
				$scope.projectID = "An error occurred while loading project IDs.";
			} else {
				$scope.projectIDs = response;
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
		).success(function(response) {
			response.pop();
			if (response.length > 0) {
				users = response;
				var staffIDList = "";
				for (var i = 0; i < users.length; i++) {
					staffIDList += ("|" + users[i].BFOSRoleID);
				}
				staffIDList += "|";
				if (response.error) {
					$scope.feedback = response.string;
				} else if (response.length > 0) {
					var users = response;
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
					).success(function(response) {
						if (response.error) {
							$scope.feedback = response.string;
						} else {
							$scope.totalResults = response.pop().TotalResults;
							$scope.tblLocationData = response;
							$scope.numberOfPages = Math.ceil($scope.totalResults / $scope.perPage);
							if ($scope.totalResults == 0) {
								$scope.feedback = "No results found.";
							} else {
								$scope.feedback = "Showing Page " + $scope.page + " of " + $scope.numberOfPages + ", Sorted by " + $scope.sortType + " in " + ($scope.sortReverse == 0 ? "Ascending " : "Descending ") + "Order";
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
}]);

myApp.controller('MileageCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.minRecordedOn = '', $scope.maxRecordedOn = '', $scope.minCreatedDt = '', $scope.maxCreatedDt = '', $scope.tblStaffMileage = "", $scope.totalResults = 0, $scope.page = 1, $scope.perPage = 10, $scope.numberOfPages = 0, $scope.feedback = "", $scope.sortType = 'StaffID', $scope.sortReverse = 0, $scope.username = "", $scope.projectID = '';

	$http.get("/getProjects?setName=userProjects").success(function(response) {
		if (response.error) {
			$scope.feedback = "An error occurred while loading project IDs.";
		} else {
			$scope.dbs = response;
			$scope.database = response[0];
			$scope.changeDB();
		}
	});

	$scope.changeDB = function() {
		$scope.projectID = "Loading Project IDs...";
		$scope.projectIDs = [{RoleType: "Loading Project IDs..."}];
		$http.get("/distinctProjectIDs?database=mobileHub").success(function(response) {
			if (response.error) {
				$scope.projectIDs = [{RoleType: "An error occurred while loading project IDs."}];
				$scope.projectID = "An error occurred while loading project IDs.";
			} else {
				$scope.projectIDs = response;
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
			"&projectID=" + $scope.projectID +
			"&username=" + $scope.username + 
			"&roleFilter=&activeFilter=&sortType=UserName&sortReverse=1&page=1&perPage=10000"
		).success(function(response) {
			response.pop();
			if (response.length > 0) {
				users = response;
				var staffIDList = "";
				for (var i = 0; i < users.length; i++) {
					staffIDList += ("|" + users[i].BFOSRoleID);
				}
				staffIDList += "|";
				$http.get(
					"/tblStaffMileage?staffIDList=" + staffIDList +
					"&minRecordedOn=" + $scope.minRecordedOn +
					"&maxRecordedOn=" + $scope.maxRecordedOn +
					"&minCreatedDt="  + $scope.minCreatedDt  +
					"&maxCreatedDt="  + $scope.maxCreatedDt  +
					"&sortType="      + $scope.sortType      +
					"&sortReverse="   + $scope.sortReverse   +
					"&page="          + $scope.page          +
					"&perPage="       + $scope.perPage       +
					"&projectID="     + $scope.projectID     +
					"&database="      + $scope.database
				).success(function(response) {
					if (response.error) {
						$scope.feedback = response.string;
					} else {
						$scope.totalResults = response.pop().TotalResults;
						$scope.tblStaffMileage = response;
						$scope.numberOfPages = Math.ceil($scope.totalResults / $scope.perPage);
						if ($scope.totalResults == 0) {
							$scope.feedback = "No results found.";
						} else {
							$scope.feedback = "Showing Page " + $scope.page + " of " + $scope.numberOfPages + ", Sorted by " + $scope.sortType + " in " + ($scope.sortReverse == 0 ? "Ascending " : "Descending ") + "Order";
						}
					}
				});
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
}]);

myApp.controller('SettingsCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.feedback = "", $scope.projectIDs = [{ProjectID: "Loading Projects..."}], $scope.projectID = "Loading Projects...", $scope.settings = [];

	$scope.changeProject = function() {
		$scope.feedback = "Loading settings...";
		$http.get("/getSettings?projectID=" + $scope.projectID).success(function(response) {
				if (response.error) {
					$scope.feedback = "An error occurred while loading settings.";
					$scope.settings = [];
				} else {
					$("#duplicateSettingsButton").show();
					$scope.feedback = "Showing settings for " + $scope.projectID + ".";
					$scope.settings = response;
				}
			}
		);
	};

	function getDistinctProjects() {
		$http.get("/distinctProjectIDsSettings").success(function(response) {
				if (response.error) {
					$scope.projectIDs = [{ProjectID: "An error occurred while loading project IDs."}];
					$scope.projectID = "An error occurred while loading project IDs.";
				} else {
					$scope.projectIDs = response;
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
		).success(function(response) {
			if (response.error) {
				$scope.feedback = response.string;
			} else {
				alert("Setting successfully updated.");
			}
		});
	};

	$scope.duplicateSettings = function() {
		$http.get(
			"/duplicateSettings?oldProject=" + $scope.projectID + 
			"&newProject=" + $scope.iProjectID
		).success(function(response) {
			if (response.error) {
				$scope.feedback = response.string;
			} else {
				$("#closeDuplicateSettings").click();
				$scope.feedback = "Settings duplicated successfully.";
				getDistinctProjects();
			}
		});
	};
}]);