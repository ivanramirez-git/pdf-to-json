import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processPdf } from '../utils/pdfUtils.js';

const router = express.Router();
const upload = multer({ dest: 'data/' });

router.post('/upload', upload.single('pdf'), async (req, res) => {
    const { path: filePath, originalname } = req.file;
    const pdfName = originalname.replace(/\s+/g, '_').replace(/\./g, '_');

    try {
        const result = await processPdf(filePath, pdfName);

        // Guardar el resultado en logs.txt
        const logFilePath = path.join('data', 'logs.txt');
        fs.appendFileSync(logFilePath, JSON.stringify(result, null, 2) + '\n');

        res.json(result);
    } catch (error) {
        console.error('Error processing PDF:', error);
        res.status(500).json({ error: 'Error processing the PDF.' });
    } finally {
        // Eliminar el archivo temporal subido
        fs.unlinkSync(filePath);
    }
});

export default router;
