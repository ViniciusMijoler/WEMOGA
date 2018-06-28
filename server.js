const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const webconfig = require('./webconfig'); 

app.use(morgan(':method | :status | HTTP :http-version | Resposta: :response-time ms | Data: :date[web] | URL: :url'));
app.use(cors());

app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, '/public/Front/Views'));
app.set('view engine', 'html');

app.use('/',express.static(path.join(__dirname, '/public')));

app.use('/app', require('./routes/Views/routes.js'));
app.use('/usuario', require('./routes/Controller/Usuarios.js'));
app.use('/funcionario', require('./routes/Controller/Funcionarios.js'));

app.get('/',function(req,res){
	if (!req.session.usuario)
		res.render('login.html');
	else
		res.redirect('/index');
});
app.get('/login',function(req,res){   	
	if (!req.session.usuario)
		res.render('login.html');
	else
		res.redirect('/index');
});
app.get('/cadastro-empresa',function(req,res){
	if (req.session.usuario){
		req.session.destroy(function(err){		
			if (err) {			
				console.error("ERRO - ", err);
				return
			}	
		});
	}
	res.render('cadastro-empresa.html');    
});
app.get('/index',function(req,res){
	if (req.session.usuario)
		res.render('index.html');
	else
		res.redirect('/login');
});

app.listen(webconfig.PORT, function(){
	console.log(`Server listennin on ${webconfig.URL}${webconfig.PORT}`);
})