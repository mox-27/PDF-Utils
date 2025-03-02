import express from 'express';
const app = express.Router();
import {MergePDF, upload} from './controllers.js';

app.get('/', (_, res) => {
    res.send('Hello World!');
});

app.post('/merge-pdf', upload.array("files", 10), MergePDF);

export default app;
