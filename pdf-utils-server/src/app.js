import express from 'express';
const app = express.Router();
import {MergePDF, upload, SplitPDF} from './controllers.js';

app.get('/', (_, res) => {
    res.send('Hello World!');
});

app.post('/merge-pdf', upload.array("files", 10), MergePDF);
app.post('/split-pdf', upload.single('files'),SplitPDF);

export default app;
