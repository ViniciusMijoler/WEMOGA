app.controller('funcionarioController', ['$scope', '$rootScope','$http', 'alertas', function($scope, $rootScope, $http, alertas){
    function Funcionario(){
        this.id_func = 0;
        this.id_empresa = $rootScope.usuario.id_empresa;
        this.nome_func = '';
        this.id_cargo = null;
        this.salario = null;
    }

    $scope.funcionario = new Funcionario();
    $scope.listFunc = []; 
    $scope.listCargos = [];

    $scope.init = function(){
        getCargos();
        getFuncionairio('');
    };

    var getCargos = function(){
        $http.get('/funcionario/getCargos')
        .then(function (response){
            $scope.listCargos = response.data;
        })
        .catch(function (err){
            console.error(err);
        });
    };

    $scope.edit = function(index){
        $scope.funcionario = angular.copy($scope.funcionarios[index]);
        $scope.funcionario.id_cargo = $scope.funcionario.id_cargo.toString();
    };
    
    $scope.novo = function(){
        $scope.funcionario = new Funcionario();
    };

    $scope.limpar = function(){
        $scope.funcionario.nome_func = '';
        $scope.funcionario.id_cargo = null;
        $scope.funcionario.salario = null;
    };
    
    $scope.save = function(){
        $http.post('/funcionario/Save/', $scope.funcionario)
        .then(function (response){
            $scope.funcionario.id_func = response.data;
            $scope.novo();
            getFuncionairio('nome_func=' + $scope.funcionario.nome_func);
            alertas.alertSucess("Registro salvo com sucesso.");
        })
        .catch(function (err){
            console.error(err);
            alertas.alertWarning('Erro ao salvar registro.');
        });
    };

    $scope.delete = function(id_func){
        $http.put('/funcionario/Delete/'+id_func)
        .then(function (response){
            alertas.alertSucess("Registro excluido com sucesso.");
            getFuncionairio('');
            $scope.funcionario = new Funcionario();
		})
        .catch(function (err){
            console.error(err);
            alertas.alertWarning('Erro ao excluir registro.');
        });
    };
    

    $scope.getFunc = function(){
        var id_cargo='', nome_func='', salario='';
        if ($scope.funcionario.id_cargo != null){
            id_cargo = 'id_cargo=' + $scope.funcionario.id_cargo;
        }
        if ($scope.funcionario.nome_func != ''){
            if ($scope.funcionario.id_cargo != null){
                nome_func = '&';
            }
            nome_func += 'nome_func=' + $scope.funcionario.nome_func;
        }
        if ($scope.funcionario.salario != null){
            if ($scope.funcionario.id_cargo != null || $scope.funcionario.nome_func != ''){
                nome_func = '&';
            }
            salario = 'salario=' + $scope.funcionario.salario;
        }

        getFuncionairio(id_cargo + nome_func + salario);
    };

    $scope.getAllFuncionarios = function(){
        getFuncionairio('');
    };
    
    var getFuncionairio = function (params){
        $http.get('/funcionario/getAll/' + $scope.funcionario.id_empresa + '?' + params)
        .then(function (response){
            $scope.listFunc = response.data.map((obj) => {
                obj.salario = parseFloat(obj.salario);
                return obj;
            });
            $scope.time = new Date().toString().substring(16, 25);

            if (response.data.lenght == 0){
                alertas.alertWarning('Nenhum registro encontrado.');
            }
		})
        .catch(function (err){
            console.error(err);
        });
    }

    $scope.OrderByMe = function(order){
		if ($scope.ordem == order)
			$scope.ordem = '-'+order;
		else
			$scope.ordem = order;
    }
    
    $scope.notSubmit = function(event){
        if (event.keyCode == 13){
            event.returnValue=false;
            event.cancel = true;
        }
    }
}]);