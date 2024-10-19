import pkg from 'pg';
const { Client } = pkg;

const conexaoPostgres = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '.',
    database: 'etapaDois',
});

export default conexaoPostgres;
