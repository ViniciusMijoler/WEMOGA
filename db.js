const pg = require('pg');

const webconfig = require('./webconfig');

var params = webconfig.DATABASE_URL.split(/[/@:]/g).reverse();

const DATABASE_URL = {
    database : params[0],
    port: params[1],
    host: params[2],
    password : params[3],
    user : params[4]
};

const pool = new pg.Pool(DATABASE_URL);

module.exports = pool;