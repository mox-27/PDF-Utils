import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const upload = multer({ dest: "uploads/" });

export const MergePDF = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No PDF files uploaded." });
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of req.files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
            fs.unlinkSync(file.path); // Remove temp files
        }

        const mergedPdfBytes = await mergedPdf.save();
        const outputDir = path.join(__dirname, "output");
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        const outputPath = path.join(outputDir, "merged.pdf");
        fs.writeFileSync(outputPath, mergedPdfBytes);

        console.log("Merged PDF created:", outputPath); // Debugging

        res.download(outputPath, "merged.pdf", (err) => {
            if (err) console.error("Error sending file:", err);
            fs.unlinkSync(outputPath); // Remove after sending
        });

    } catch (error) {
        console.error("MergePDF Error:", error);
        res.status(500).json({ error: error.message });
    }
};
