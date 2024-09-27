import express from 'express';
import router from './routes.js';

const app = express();
const PORT = 3000;

app.use(router);

app.listen(PORT, (error) => {
    if(!error) console.log(`Server running on port ${PORT}`)
    else console.log(`Error: ${error}`)
})

