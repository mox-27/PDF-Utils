import express from 'express';
import dotenv from 'dotenv';
import appRouter from './app.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use('/api/v1/', appRouter);

app.get('/', (_, res) => {
    res.send('Server is Running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});