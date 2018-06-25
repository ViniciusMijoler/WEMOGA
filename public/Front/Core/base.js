var app = angular.module('CrudApp', ['ngStorage', 'ngRoute']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
	
	$routeProvider
	.when("/",{
		templateUrl: 'inicio',
		controller: 'mva-inicio.js'
	})
	.otherwise({redirectTo: '/'});
}]);