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

module.exports = router;