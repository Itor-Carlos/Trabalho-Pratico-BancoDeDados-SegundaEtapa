import express from 'express';
import router from './routes.js';
import conexaoPostgres from './database/index.js';

const app = express();
const PORT = 3000;

app.use(router);

app.listen(PORT, async (error) => {
    if(!error){
        console.log(`Server running on port ${PORT}`)
        conexaoPostgres.connect();
    } 
    else console.log(`Error: ${error}`)
})

