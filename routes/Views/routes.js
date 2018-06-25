const express = require('express');
const router = express.Router();

// encerra sessao
router.get('/logout',function(req,res){		
	req.session.destroy(function(err){		
		if (err) {			
			console.log(err);
			return
		}	
	});
	res.redirect('/login');	
});

module.exports = router;