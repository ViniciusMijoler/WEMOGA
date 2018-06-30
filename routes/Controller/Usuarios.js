const express = require('express');
const router = express.Router();

const pool = require('../../db');

router.post('/logar', function (req, res) {
	pool.connect(function (err, client, done) {
		if (err) {
			done();
			res.status(404).send(err);
			console.error('ERRO ao conectar no banco - ' + err);
			return;
		}

		var sql = `
					SELECT U.id_usuario, E.id as id_empresa, U.usuario as user, E.nome
					  FROM tb_usuario U 
					  		INNER JOIN tb_empresa E ON (E.id_usuario = U.id_usuario)
					 WHERE 	   U.usuario = '${req.body.user}'
						   AND U.senha = md5('${req.body.senha}')
						   AND U.status = 1
				`;

		client.query(sql, function (err, result) {
			done(); // libera a conexão
			if (err) {
				res.status(404).send(err);
				console.error('Erro - ', err);
				return;
			}

			var usuario = result.rows[0];

			if (usuario != null) {
				req.session.usuario = usuario;
			}
			res.json(req.session.usuario);
		});
	});
});

router.get('/verificarUsuario/:usuario', function (req, res) {
	pool.connect((err, client, done) => {
		if (err){
			done();
			res.status(404).send(err);
			console.error('Erro ao conectar no banco: \n', err);
			return;
		}

		var sql = `
					SELECT COUNT(*) as count
					  FROM tb_usuario
					 WHERE usuario = '${req.params.usuario}';
				`;

		client.query(sql, (err, result) => {
			done();
			if (err){
				res.status(404).send(err);
				console.error('Erro - ', err);
				return
			}
			
			var count = result.rows[0].count;

			if (count > 0){
				res.status(200).send(false).end();
			}else{
				res.status(200).send(true).end();
			}
		});
	});
});

router.get('/getEmpresa/:id_usuario', function (req, res) {
	pool.connect((err, client, done) => {
		if (err){
			done();
			res.status(404).send(err);
			console.error('Erro ao conectar no banco: \n', err);
			return;
		}

		var sql = `
					SELECT U.id_usuario,
						   U.usuario as user,
						   E.id as id_empresa, 
						   E.nome,
						   E.cep,
						   E.logradouro,
						   E.numero,
						   E.complemento ,
						   E.bairro,
						   E.cidade,
						   E.uf,
						   F.id_tel,
						   F.telefone
					  FROM tb_usuario U 
							INNER JOIN tb_empresa E ON (E.id_usuario = U.id_usuario AND E.status = 1)
							LEFT JOIN tb_telefone F ON (F.id_empresa = E.id AND F.status = 1)
					 WHERE U.id_usuario = ${req.params.id_usuario} AND U.status = 1
				`;

		client.query(sql, (err, result) => {
			done();
			if (err){
				res.status(404).send(err);
				console.error('Erro - ', err);
				return
			}

			var count = result.rowCount;

			if (count > 0){
				res.json(result.rows[0]);
			} else{
				console.error('Erro - dados usuario não encontrado');
				res.status(404).send('Erro - dados usuario não encontrado');
			}
		});
	});
});

router.post('/cadastrarEmpresa', function (req, res) {
	pool.connect((err, client, done) => {
		if (err){
			done();
			res.status(404).send(err);
			console.error('Erro ao conectar no banco: \n', err);
			return;
		}

		const shouldAbort = (err) => {
			if (err) {
				console.error('Error in transaction', err.stack)
				client.query('ROLLBACK', (err) => {
					if (err) {
						console.error('Error rolling back client', err.stack)
					}
					// release the client back to the pool
					done()
				})
			}
			return !!err
		}

		client.query('BEGIN', (err) => {
			if (shouldAbort(err)){
				res.status(404).send('Erro ao cadastrar');
				return
			}

			var sql = `
						INSERT INTO tb_usuario (usuario, senha) 
						VALUES ('${req.body.usuario}', md5('${req.body.senha}'))
						RETURNING id_usuario;
					`;

			client.query(sql, (err, result) => {
				if (shouldAbort(err)){
					res.status(404).send('Erro ao cadastrar');
					return
				} 

				sql = `	INSERT INTO tb_empresa (id_usuario, 
												nome, 
												cep, 
												logradouro, 
												numero, 
												complemento, 
												bairro, 
												cidade, 
												uf)
						VALUES (${result.rows[0].id_usuario},
								'${req.body.nome}',
								'${req.body.cep}',
								'${req.body.logradouro}',
								${req.body.numero},
								'${req.body.complemento}',
								'${req.body.bairro}',
								'${req.body.cidade}',
								'${req.body.uf}')
						RETURNING id;
					`;
				client.query(sql, (err, result) => {
					if (shouldAbort(err)){
						res.status(404).send('Erro ao cadastrar');
						return
					} 
					
					if (req.body.telefone && req.body.telefone != null && req.body.telefone.trim() != ''){
						sql = `
								INSERT INTO tb_telefone (id_empresa, telefone)
								VALUES (${result.rows[0].id}, '${req.body.telefone}');
							`;
	
						client.query(sql, (err, result) => {
							if (shouldAbort(err)){
								res.status(404).send('Erro ao cadastrar');
								return
							} 
	
							client.query('COMMIT', (err) => {
								done()
								if (err) {
									res.status(404).send('Erro ao cadastrar.');
									console.error('Error committing transaction', err.stack)
									return
								}
	
								res.status(200).send('Cadastrado com sucesso');
							});
						});
					}
					else {
						client.query('COMMIT', (err) => {
							done()
							if (err) {
								res.status(404).send('Erro ao cadastrar.');
								console.error('Error committing transaction', err.stack)
								return
							}

							res.status(200).send('Cadastrado com sucesso');
						});
					}
				});
			});
		});
	});
});

router.put('/atualizarEmpresa', function (req, res) {
	pool.connect((err, client, done) => {
		if (err){
			done();
			res.sendStatus(400);
			console.error('Erro ao conectar no banco: \n', err);
			return;
		}

		var sql = '';
		var updateExecs = 0;

		if (req.body.senha != '' && req.body.senha != null && typeof req.body.senha != 'undefined'){
			updateExecs++;

			sql = `
					UPDATE tb_usuario
					   SET senha = md5('${req.body.senha}')
					 WHERE id_usuario = ${req.body.id_usuario};
				`;
		}

		sql += `
				UPDATE tb_empresa
					SET nome = '${req.body.nome}',
						cep = '${req.body.cep}',
						logradouro = '${req.body.logradouro}',
						numero = ${req.body.numero},
						complemento = '${req.body.complemento}',
						bairro = '${req.body.bairro}',
						cidade = '${req.body.cidade}',
						uf = '${req.body.uf}'
					WHERE 	   id = ${req.body.id_empresa}
						AND id_usuario = ${req.body.id_usuario};

			`;

		if (req.body.id_tel != null){
			updateExecs++;

			sql += `
					UPDATE tb_telefone
						SET telefone = '${req.body.telefone}'
						WHERE     id_tel = ${req.body.id_tel}
							AND id_empresa = ${req.body.id_empresa}
					RETURNING id_tel;
				`;
		}
		else if (req.body.telefone && req.body.telefone != null && req.body.telefone.trim() != ''){
			updateExecs++;

			sql += `
					INSERT INTO tb_telefone (id_empresa, telefone)
					VALUES (${req.body.id_empresa}, '${req.body.telefone}')
					RETURNING id_tel;
				`;

		}

		client.query(sql, (err, result) => {
			done();
			if (err){
				res.status(404).send(err);
				console.error('Erro - ', err);
				return;
			} 

			if (result[updateExecs])
				res.json(result[updateExecs].rows[0].id_tel);
			else 
				res.json(null);
		});
	});
});

router.put('/removeEmpresa/:id_usuario', function (req, res) {
	pool.connect((err, client, done) => {
		if (err){
			done();
			res.sendStatus(400);
			console.error('Erro ao conectar no banco: \n', err);
			return;
		}

		var sql = `
					UPDATE tb_usuario
					   SET status = 0
					 WHERE id_usuario = ${req.params.id_usuario};
				`;

		client.query(sql, (err, result) => {
			done();
			if (err){
				res.status(404).send(err);
				console.error('Erro - ', err);
				return;
			}

			res.status(200).send(true);
		});
	});
});

router.get('/getUser', function(req, res){
	res.status(200).send(req.session.usuario);
});
// encerra sessao
router.get('/logout', function(req, res){		
	req.session.destroy(function(err){		
		if (err) {
			res.status(404).send(err);
			console.error("ERRO - ", err);
			return
		}	
	});
	res.redirect('/login');	
});

module.exports = router;