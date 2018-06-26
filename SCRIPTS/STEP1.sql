CREATE DATABASE "TESTE_WEMOGA"
ENCODING 'WIN1252'
TEMPLATE = template0
CONNECTION LIMIT -1;

CREATE TABLE tb_usuario(
	id_usuario	SERIAL,
	usuario		VARCHAR(20) CONSTRAINT u_nn_usuario_usuario UNIQUE NOT NULL,
	senha		VARCHAR(32) CONSTRAINT nn_usuario_senha NOT NULL,
	status		INTEGER NOT NULL DEFAULT 1,
	CONSTRAINT pk_tb_usuario PRIMARY KEY (id_usuario)
);

CREATE TABLE tb_empresa(
	id		SERIAL,
	id_usuario	INTEGER CONSTRAINT u_nn_usuario_usuario UNIQUE NOT NULL,
	nome		VARCHAR(200),
	cep		VARCHAR(8),
	logradouro	VARCHAR(60),
	numero		INTEGER,
	complemento	VARCHAR(200),
	bairro		VARCHAR(60),
	cidade		VARCHAR(50),
	uf		VARCHAR(2),
	status		INTEGER NOT NULL DEFAULT 1,
	CONSTRAINT pk_tb_empresa PRIMARY KEY (id),
	CONSTRAINT fk_empresa_id_usuario FOREIGN KEY (id_usuario)
		REFERENCES tb_usuario (id_usuario)
);

CREATE TABLE tb_telefone(
	id_tel		SERIAL,
	id_empresa	INTEGER,	
	telefone	VARCHAR(16), -- 04116991386692
	status		INTEGER NOT NULL DEFAULT 1,
	CONSTRAINT pk_tb_telefone PRIMARY KEY (id_tel),
	CONSTRAINT fk_telefone_id_empresa FOREIGN KEY (id_empresa)
		REFERENCES tb_empresa (id)
);

CREATE TABLE tb_cargo(
	id_cargo	SERIAL,
	nome_cargo	VARCHAR(200),
	status		INTEGER NOT NULL DEFAULT 1,
	CONSTRAINT pk_tb_cargo PRIMARY KEY (id_cargo)
);

INSERT INTO tb_cargo (nome_cargo)
VALUES ('Programador'),('Designer'),('Administração');

CREATE TABLE tb_funcionario(
	id_func		SERIAL,
	id_empresa	INTEGER,
	nome_func	VARCHAR(200),
	id_cargo	INTEGER,
	salario		NUMERIC(10,2),
	status		INTEGER NOT NULL DEFAULT 1,
	CONSTRAINT pk_tb_funcionario PRIMARY KEY (id_func),
	CONSTRAINT fk_funcionario_id_empresa FOREIGN KEY (id_empresa)
		REFERENCES tb_empresa (id),
	CONSTRAINT fk_funcionario_id_cargo FOREIGN KEY (id_cargo)
		REFERENCES tb_cargo (id_cargo)
);