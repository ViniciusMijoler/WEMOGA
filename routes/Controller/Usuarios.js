const express = require('express');
const router = express.Router();

const pool = require('../../db');

router.post('/logar', function (req, res) {
	pool.connect(function (err, client, done) {
		if (err) {
			console.error('Erro ao conectar no banco: \n', erro);
			return;
		}

		var sql = `
					SELECT U.id_usuario, U.usuario, E.nome
					  FROM tb_usuario U 
					  		INNER JOIN tb_empresa E ON (E.id_usuario = U.id_empresa)
					 WHERE 	   usuario = '${req.body.usuario}'
				     	   AND senha = md5('${req.body.senha}')
				`;

		client.query(sql, function (err, result) {
			done(); // libera a conexão
			if (err) {
				res.sendStatus(400);
				console.error('Erro - ', erro);
				return;
			}

			var usuario = result.rows[0];

			if (usuario != null) {
				req.session = {
					usuario: usuario.usuario,
					nome: usuario.nome,
					id_usuario: usuario.id_usuario
				}
			}
			res.json(usuario);
		});
	});
});

router.get('/verificarUsuario/:usuario', function (req, res) {
	pool.connect((err, client, done) => {
		if (err){
			console.error('Erro ao conectar no banco: \n', erro);
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
				res.sendStatus(404);
				console.error('Erro - ', erro);
				return
			}
			
			var count = result.rows[0].count;

			console.log(count);

			if (count > 0){
				res.status(200).send(false).end();
			}else{
				res.status(200).send(true).end();
			}
		});
	});
});


router.post('/cadastrarEmpresa', function (req, res) {
	pool.connect((err, client, done) => {
		if (err){
			console.error('Erro ao conectar no banco: \n', erro);
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
				res.status(404).send('Erro ao cadastrar').end();
				return
			}

			var sql = `
						INSERT INTO tb_usuario (usuario, senha) 
						VALUES ('${req.body.usuario}', md5('${req.body.senha}'))
						RETURNING id_usuario;
					`;

			client.query(sql, (err, result) => {
				if (shouldAbort(err)){
					res.status(404).send('Erro ao cadastrar').end();
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
						res.status(404).send('Erro ao cadastrar').end();
						return
					} 
					
					if (req.body.telefone){
						sql = `
								INSERT INTO tb_telefone (id_empresa, telefone)
								VALUES (${result.rows[0].id}, '${req.body.telefone}');
							`;
	
						client.query(sql, (err, result) => {
							if (shouldAbort(err)){
								res.status(404).send('Erro ao cadastrar').end();
								return
							} 
	
							client.query('COMMIT', (err) => {
								done()
								if (err) {
									res.status(404).send('Erro ao cadastrar.').end();
									console.error('Error committing transaction', err.stack)
									return
								}
	
								res.status(200).send('Cadastrado com sucesso').end();
							});
						});
					}
					else {
						client.query('COMMIT', (err) => {
							done()
							if (err) {
								res.status(404).send('Erro ao cadastrar.').end();
								console.error('Error committing transaction', err.stack)
								return
							}

							res.status(200).send('Cadastrado com sucesso').end();
						});
					}
				});
			});
		});
	});
});

module.exports = router;