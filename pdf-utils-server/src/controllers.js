import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import archiver from 'archiver';

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
export const SplitPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const pdfPath = req.file.path;
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        // Parse splitPages from formats like "1", "1-3", "1,2" or "1-2,4-5"
        let pagesToSplit;
        if (req.body.splitPages) {
            pagesToSplit = req.body.splitPages
                .split(',')
                .map(range => {
                    range = range.trim();
                    if (range.includes('-')) {
                        const [start, end] = range.split('-').map(num => parseInt(num, 10));
                        const pages = [];
                        for (let i = start; i <= end; i++) {
                            pages.push(i);
                        }
                        return pages;
                    } else {
                        return [parseInt(range, 10)];
                    }
                });
        } else {
            pagesToSplit = Array.from({ length: totalPages }, (_, i) => [i + 1]);
        }


        const outputFiles = [];
        for (const pageGroup of pagesToSplit) {
            const newPdf = await PDFDocument.create();
            for (const pageNum of pageGroup) {
                if (pageNum > 0 && pageNum <= totalPages) {
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
                    newPdf.addPage(copiedPage);
                }
            }
            const newPdfBytes = await newPdf.save();
            const outputPath = `uploads/split_${Date.now()}_${pageGroup.join("-")}.pdf`;
            fs.writeFileSync(outputPath, newPdfBytes);
            outputFiles.push(outputPath);
        }
        
        fs.unlinkSync(pdfPath); // Remove the original file after processing

        // Create ZIP archive
        const zipFilePath = `uploads/split_pdfs_${Date.now()}.zip`;
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => {
            // Send ZIP file as response
            res.download(zipFilePath, "split_pdfs.zip", (err) => {
                if (err) {
                    console.error("Error sending ZIP file:", err);
                    res.status(500).json({ error: "Error sending ZIP file" });
                }
                // Cleanup files after sending response
                outputFiles.forEach(file => fs.unlinkSync(file));
                fs.unlinkSync(zipFilePath);
            });
        });

        archive.on("error", (err) => {
            console.error("Error creating ZIP archive:", err);
            res.status(500).json({ error: "Error creating ZIP archive" });
        });

        archive.pipe(output);
        outputFiles.forEach(file => {
            archive.file(file, { name: path.basename(file) });
        });
        archive.finalize();
    } catch (error) {
        console.error("Error splitting PDF:", error);
        res.status(500).json({ error: "Error processing PDF" });
    }
};

