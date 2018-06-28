const express = require('express');
const router = express.Router();

const pool = require('../../db');

router.post('/Save', function (req, res) {
	pool.connect(function (err, client, done) {
		if (err) {
			done();
			res.status(404).send(err);
			console.error('ERRO ao conectar no banco - ' + err);
			return;
		}

        var sql

        if (req.body.id_func == 0){
		    sql = `
                    INSERT INTO TB_FUNCIONARIO (id_empresa, 
                                                nome_func, 
                                                id_cargo, 
                                                salario)
                    VALUES (${req.body.id_empresa},
                            '${req.body.nome_func}',
                            ${req.body.id_cargo},
							${req.body.salario})
					RETURNING id_func;
				`;
        }
        else {
            sql = `
                    UPDATE TB_FUNCIONARIO
                       SET id_empresa = ${req.body.id_empresa},
                           nome_func = '${req.body.nome_func}',
                           id_cargo = ${req.body.id_cargo},
                           salario = ${req.body.salario}
                     WHERE id_func = ${req.body.id_func}
					RETURNING id_func;
                `;
		}

		client.query(sql, function (err, result) {
			done(); // libera a conexão
			if (err) {
				res.status(404).send(err);
				console.error('Erro - ', err);
				return;
			}

			res.json(result.rows[0].id_func);
		});
	});
});

router.put('/Delete/:id_func', function (req, res) {
	pool.connect(function (err, client, done) {
		if (err) {
			done();
			res.status(404).send(err);
			console.error('ERRO ao conectar no banco - ' + err);
			return;
		}

        var sql = `
                    UPDATE TB_FUNCIONARIO
                       SET status = 0
                     WHERE id_func = ${req.params.id_func};
                `;

		client.query(sql, function (err, result) {
			done(); // libera a conexão
			if (err) {
				res.status(404).send(err);
				console.error('Erro - ', err);
				return;
			}

			res.status(200).send('Registro deletado com sucesso.');
		});
	});
});

router.get('/getAll/:id_empresa', function (req, res) {
    if (typeof req.query.id_cargo == 'undefined'){	
        req.query.id_cargo = null;
    }
    if (req.query.nome_func == null || typeof req.query.nome_func != 'string'){
        req.query.nome_func = '';
    }
    if (typeof req.query.salario == 'undefined'){
        req.query.salario = null;
	}

	pool.connect(function (err, client, done) {
		if (err) {
			done();
			res.status(404).send(err);
			console.error('ERRO ao conectar no banco - ' + err);
			return;
		}

        var sql;

        sql = `
               SELECT f.id_func, f.id_empresa, f.nome_func, f.id_cargo, c.nome_cargo, f.salario
                 FROM TB_FUNCIONARIO f
                       INNER JOIN TB_CARGO c ON (f.id_cargo = c.id_cargo)
                WHERE f.status = 1 AND f.id_empresa = ${req.params.id_empresa}`;

        if (req.query.id_cargo != null){
            sql += ` AND f.id_cargo = ${req.query.id_cargo}`;
		}
		if (req.query.nome_func != ''){
            sql += ` AND f.nome_func LIKE '%${req.query.nome_func}%'`;
        }
		if (req.query.salario != null){
            sql += ` AND f.salario = ${req.query.salario}`;
		}

		sql += ' ORDER BY f.nome_func';

		client.query(sql, function (err, result) {
			done(); // libera a conexão
			if (err) {
				res.status(404).send(err);
				console.error('Erro - ', err);
				return;
			}

			res.json(result.rows);
		});
	});
});

router.get('/getCargos', function (req, res) {
	pool.connect(function (err, client, done) {
		if (err) {
			done();
			res.status(404).send(err);
			console.error('ERRO ao conectar no banco - ' + err);
			return;
		}

        var sql = `
					SELECT id_cargo, nome_cargo
					  FROM TB_CARGO
				     WHERE status = 1
				`;
				
		client.query(sql, function (err, result) {
			done(); // libera a conexão
			if (err) {
				res.status(404).send(err);
				console.error('Erro - ', err);
				return;
			}

			res.json(result.rows);
		});
	});
});

module.exports = router;