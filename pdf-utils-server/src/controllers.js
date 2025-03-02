import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const upload = multer({ dest: "uploads/" });

export const MergePDF = async (req, res) => {
    try {
        const mergedPdf = await PDFDocument.create();

        for (const file of req.files) {
            const pdfBytes = fs.readFileSync(file.path);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
            fs.unlinkSync(file.path);
        }

        const mergedPdfBytes = await mergedPdf.save();
        const outputPath = path.join(__dirname, "output", "merged.pdf");
        fs.writeFileSync(outputPath, mergedPdfBytes);

        res.download(outputPath, "merged.pdf", () => fs.unlinkSync(outputPath));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}