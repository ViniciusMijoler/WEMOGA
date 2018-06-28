app.controller('perfilController', ['$scope', '$rootScope','$http', '$timeout', 'alertas', 'viaCep', function($scope, $rootScope, $http, $timeout, alertas, viaCep){
    $scope.init = function (){
        getEmpresa();
    }

    var getEmpresa = function (){
        $http.get('/usuario/getEmpresa/'+$rootScope.usuario.id_usuario).then(function (response){
            if (response.status == 200){   
                $scope.empresa = response.data;
                $scope.empresa.senha = '';
            }
        })
    }

    $scope.desativar = function (){
        $http.delete('/usuario/removeEmpresa/'+$rootScope.usuario.id_usuario).then(function (response){
            if (response.data){
                alertas.alertSucess('Perfil desativado. O usuário será desconectado.');

                $timeout( function(){
                    $rootScope.usuario = undefined;
                    $scope.usuario = undefined;
                    window.location.href = "/usuario/logout";
                }, 1500 );
            }
            else {
                alertas.alertDanger('Erro ao desativar perfil.');
            }
        })
    }

    $scope.save = function (){
        if ($scope.empresa.nome.length == 0){
            alertas.alertWarning('Nome da empresa obrigatório.');
            return;
        }

        $http.put('/usuario/atualizarEmpresa', $scope.empresa).then(function (response){
            if (response.data){
                $scope.empresa.id_tel = parseInt(response.data);
                alertas.alertSucess('Perfil salvo.');
            }
            else {
                alertas.alertDanger('Erro ao salvar o perfil.');
            }
        })
    }
}]);