var app = angular.module('cadastroApp', ['ngMask', 'angular.viacep']);

function Empresa(){
	this.usuario = '';
    this.senha = '';
    this.nome = '';
    this.telefone = '';
    this.cep = '';
    this.logradouro = '';
    this.cidade = '';
    this.bairro = '';
    this.uf = '';
    this.complemento = '';
    this.numero = null;
}

app.controller('cadastroController', ['$scope', '$http', 'alertas', 'viaCep', function($scope, $http, alertas, viaCep){
    $scope.empresa = new Empresa();
    
	$scope.save = function(){
		$http.get('/usuario/verificarUsuario/'+$scope.empresa.usuario).then(function (response){
			if (response.data) {
                $http.post('/usuario/cadastrarEmpresa', $scope.empresa).then(function (response){
                    alertas.alertSucess(response.data)
                });
            }
            else {
                alertas.alertDanger('Usuario já cadastro.')
            }
		});
	};
}]);