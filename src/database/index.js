import pkg from 'pg';
const { Client } = pkg;

const conexaoPostgres = new Client({
    host: 'fazenda-graos.cvdwj5oi2o08.us-east-1.rds.amazonaws.com',
    port: 5432,
    user: 'professor',
    password: 'professor',
    database: 'bd',
    ssl: {
        rejectUnauthorized: false,
    }
});

export default conexaoPostgres;
