import express from 'express';
import router from './routes.js';
import conexaoPostgres from './database/index.js';

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(router);

app.listen(PORT, async (error) => {
    if(!error){
        console.log(`Server running on port ${PORT}`)
        conexaoPostgres.connect();
        conexaoPostgres.query('SET search_path TO fazenda;')
    } 
    else console.log(`Error: ${error}`)
})

