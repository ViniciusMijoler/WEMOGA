var app = angular.module('CrudApp', ['ngRoute']);

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
	.when("/funcionario/cadastro", {
		templateUrl: '/app/funcionario/cadastro',
		controller: 'cadFuncionarioController'
	})
	.when("/funcionario/consulta", {
		templateUrl: '/app/funcionario/consulta',
		controller: 'consulFuncionarioController'
	})
	.otherwise({redirectTo: '/index'});
}]);