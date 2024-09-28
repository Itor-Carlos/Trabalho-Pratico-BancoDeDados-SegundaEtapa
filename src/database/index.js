import pkg from 'pg';
const { Client } = pkg;

const conexaoPostgres = new Client({
    host: 'databaseufs.cxcqkp3h7gwq.us-east-1.rds.amazonaws.com',
    port: 5432,
    user: "aluno",
    password: "alunoufs",
    database: "etapaDois",
    ssl: {
        rejectUnauthorized: false,
    }
});

export default conexaoPostgres;
