const pg = require('pg');

const webconfig = require('./webconfig');
const DATABASE_URL = webconfig.DATABASE_URL;

var configDb = {
    user: "postgres",
    database: "TESTE_WEMOGA",
    password: "mva7155",
    port: 5432,
    max: 10,
    idleTimeoutMills: 30000
}

const pool = DATABASE_URL ? new pg.Pool({DATABASE_URL, ssl: true}) : new pg.Pool(configDb);

module.exports = pool;