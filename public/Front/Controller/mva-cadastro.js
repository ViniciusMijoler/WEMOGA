var app = angular.module('cadastroApp', ['ngMask', 'angular.viacep']);

app.controller('cadastroController', ['$scope', '$http', 'alertas', 'viaCep', function($scope, $http, alertas, viaCep){
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
    
    $scope.empresa = new Empresa();
    
	$scope.save = function(){
        $http.get('/usuario/verificarUsuario/'+$scope.empresa.usuario)
        .then(function (response){
			if (response.data) {
                $http.post('/usuario/cadastrarEmpresa', $scope.empresa)
                .then(function (response){
                    alertas.alertSucess(response.data)
                })
                .catch(function (err){
                    console.log(err);
                });;
            }
            else {
                alertas.alertWarning('Usuario já cadastro.')
            }
		})
		.catch(function (err){
			console.log(err);
		});;
    };
    
    $scope.notSubmit = function(event){
        if (event.keyCode == 13){
            event.returnValue=false;
            event.cancel = true;
        }
    }
}]);