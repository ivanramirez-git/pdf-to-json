import express from 'express';
import multer from 'multer';
import path from 'path';
import { processPdf } from './utils/pdfUtils.js';

const app = express();
const upload = multer({ dest: 'data/' });

app.use(express.static('public'));

app.post('/api/pdf/upload', upload.single('pdf'), async (req, res) => {
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const cancelToken = { cancelled: false };

    try {
        const result = await processPdf(filePath, fileName, (currentPage, totalPages) => {
            console.log(`Processing page ${currentPage} of ${totalPages}`);
        }, cancelToken);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});