app.controller('userControler', ['$scope', '$rootScope','$http', 'alertas', function($scope, $rootScope, $http, alertas){
	function User(){
		this.user = '';
		this.senha = '';
	}
	
	$scope.usuario = new User();

	$scope.init = function(){
		getUser();
	}

	var getUser = function(){
		$http.get('/usuario/getUser').then(function (response){
			$rootScope.usuario = response.data;
			$scope.usuario = response.data;
		});
	}

	$scope.logout = function(){
		$rootScope.usuario = undefined;
		$scope.usuario = undefined;
		window.location.href = "/usuario/logout";
	}
}]);