function User(){
	this.user = '';
	this.senha = '';
}

app.controller('userControler', ['$scope', '$http', 'alertas', function($scope, $http, alertas){
	$scope.usuario = new User();
	$scope.entrar = function(){
		$http.post('/logar', $scope.usuario).then(function (response){
			if (response.data) { 
				window.location.href = '/index';
			} else {
				alertas.alertDanger("Usuario ou senha incorreto!");
			}
		});
	};
}]);