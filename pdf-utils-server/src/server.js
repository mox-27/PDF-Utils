import express from 'express';
import dotenv from 'dotenv';
import appRouter from './app.js';
import cors from 'cors';

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
app.use(cors());
app.use('/api/v1/', appRouter);
app.use(express.json());

app.get('/', (_, res) => {
    res.send('Server is Running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});