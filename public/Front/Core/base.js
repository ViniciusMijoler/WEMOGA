var app = angular.module('CrudApp', ['ngRoute', 'ngMask', 'angular.viacep']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);
	
	$routeProvider
	.when("/index",{
		templateUrl: '/app/inicio'
	})
	.when("/configuracao/perfil", {
		templateUrl: '/app/configuracao/perfil',
		controller: 'perfilController'
	})
	.when("/funcionario/detalhes", {
		templateUrl: '/app/funcionario/',
		controller: 'funcionarioController'
	})
	.otherwise({redirectTo: '/index'});
}]);