var app = angular.module('CrudApp', []);

function User(){
	this.user = '';
	this.senha = '';
}

app.controller('LoginController', ['$scope', '$http', 'alertas', function($scope, $http, alertas){
	$scope.usuario = new User();
	$scope.entrar = function(){
		$http.post('/usuario/logar', $scope.usuario).then(function (response){
			if (response.data) { 
				window.location.href = '/index';
			} else {
				alertas.alertDanger("Usuario ou senha incorreto!");
			}
		});
	};
}]);