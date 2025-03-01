import express from 'express';
const app = express.Router();

app.get('/', (_, res) => {
    res.send('Hello World!');
});

export default app;
