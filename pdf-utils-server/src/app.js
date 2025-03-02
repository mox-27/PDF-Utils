import express from 'express';
const app = express.Router();
import {MergePDF} from './controllers.js';

app.get('/', (_, res) => {
    res.send('Hello World!');
});

app.get('/merge', MergePDF);

export default app;
