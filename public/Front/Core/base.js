var app = angular.module('CrudApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
	
	$routeProvider
	.when("/index",{
		templateUrl: '/app/inicio'
	})
	.otherwise({redirectTo: '/index'});
}]);