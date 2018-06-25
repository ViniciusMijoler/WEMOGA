const express = require('express');
const router = express.Router();

router.get('/inicio',function(req,res){
	if (req.session.usuario){
		res.render('Inicio/inicio.html');
    }
	else {
		res.redirect('/login');
    }
});

router.get('/funcionario/cadastro',function(req,res){
	if (req.session.usuario){
		res.render('Funcionarios/cadastro.html');
    }
	else {
		res.redirect('/login');
    }
});

router.get('/funcionario/consulta',function(req,res){
	if (req.session.usuario){
		res.render('Funcionarios/consulta.html');
    }
	else {
		res.redirect('/login');
    }
});

router.get('/configuracao/perfil',function(req,res){
	if (req.session.usuario){
		res.render('Configuracao/Perfil/perfil.html');
    }
	else {
		res.redirect('/login');
    }
});

module.exports = router;