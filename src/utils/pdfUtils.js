import { fromPath as pdf2picFromPath } from 'pdf2pic';
import fs from 'fs';
import path from 'path';
import { analyzeImage } from '../openai.js';
import { PDFDocument } from 'pdf-lib';

const getNumberOfPages = async (filePath) => {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getPageCount();
};

const getPageSize = async (filePath, pageIndex) => {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(pageIndex);
    const { width, height } = page.getSize();
    return { width, height };
};

const ensureDirectoryExistence = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const generateOutputDirectory = (filePath) => {
    const fileName = path.basename(filePath, '.pdf').replace(/\s+/g, '_').replace(/\./g, '_');
    const outputDir = path.join('data/generated', fileName + '_' + new Date().toISOString().replace(/:/g, '-').replace(/\./g, '_'));
    ensureDirectoryExistence(outputDir);
    return outputDir;
};

const extractJsonFromText = (text) => {
    console.log(text);
    const jsonStart = text.indexOf('```json');
    const jsonEnd = text.lastIndexOf('```');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = text.substring(jsonStart + 7, jsonEnd).trim();
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Failed to parse JSON:', error);
        }
    }
    return null;
};

const processPdf = async (filePath, nameBook, updateProgress, cancelToken) => {
    const outputDir = generateOutputDirectory(filePath);
    const numberOfPages = await getNumberOfPages(filePath);
    const results = [];

    // Generar todas las imágenes primero
    const imagePaths = [];
    for (let i = 0; i < numberOfPages; i++) {
        if (cancelToken.cancelled) {
            return { error: "Process cancelled by user." };
        }

        const { width, height } = await getPageSize(filePath, i);
        const options = {
            density: 500, // Aumentar la densidad para mayor calidad
            saveFilename: `image_${i + 1}`,
            savePath: outputDir,
            format: 'png',
            width: Math.floor(height * 1.5), // Invertir el ancho y la altura
            height: Math.floor(width * 1.5),
            quality: 100 // Mejorar la calidad de la imagen
        };

        const pdf2picInstance = pdf2picFromPath(filePath, options);
        const output = await pdf2picInstance(i + 1); // Las páginas en pdf2pic son 1-indexed
        imagePaths.push(output.path);
    }

    // Hacer los llamados a OpenAI para cada imagen generada y actualizar el archivo JSON
    for (let i = 0; i < imagePaths.length; i++) {
        if (cancelToken.cancelled) {
            return { error: "Process cancelled by user." };
        }

        try {
            const analysis = await analyzeImage(imagePaths[i], nameBook);

            console.log(analysis);

            const jsonContent = extractJsonFromText(analysis);
            if (jsonContent) {
                results.push(jsonContent);
            } else {
                console.error(`No valid JSON found for page ${i + 1}`);
            }
            const outputFilePath = path.join(outputDir, `${path.basename(filePath, '.pdf').replace(/\s+/g, '_').replace(/\./g, '_')}.json`);
            fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2));
            updateProgress(i + 1, numberOfPages);
        } catch (error) {
            console.error(`Error processing page ${i + 1}:`, error);
            return { error: `Error processing page ${i + 1}: ${error.message}` };
        }
    }

    return results;
};

export { processPdf };