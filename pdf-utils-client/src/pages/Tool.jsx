import { useParams } from "react-router-dom";
import FileUpload from "./FileUpload";
import { useRef, useState } from "react";
import axios from "axios";

export const Tool = () => {
    const [files, setFiles] = useState([]);
    const [password, setPassword] = useState("");
    const [splitPages, setSplitPages] = useState("");
    const fileInputRef = useRef(null);
    const { tool } = useParams();

    const getToolContent = () => {
        switch (tool) {
            case "merge-pdf":
                return { title: "Merge PDFs", description: "Upload PDFs to merge them into a single file." };
            case "split-pdf":
                return { title: "Split PDF", description: "Split your PDF into multiple files." };
            case "image-to-pdf":
                return { title: "Image to PDF", description: "Convert your images into a PDF file." };
            case "compress-pdf":
                return { title: "Compress PDF", description: "Reduce PDF file size while maintaining quality." };
            case "protect-pdf":
                return { title: "Protect PDF", description: "Add password protection to your PDF." };
            case "unprotect-pdf":
                return { title: "Unprotect PDF", description: "Remove password from your PDF." };
            default:
                return { title: "PDF Tool", description: "Select a tool to get started." };
        }
    };

    const toolContent = getToolContent();

    const processPDF = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            alert("Please upload at least one PDF file.");
            return;
        }

        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file)); // Ensure correct field name
            console.log(files);
            
            if (tool === "protect-pdf" || tool === "unprotect-pdf") {
                formData.append("password", password);
            } else if (tool === "split-pdf") {
                formData.append("splitPages", splitPages);
            }



            const response = await axios.post(
                `http://localhost:3001/api/v1/${tool}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            // Download the processed PDF
            const link = document.createElement("a");
            link.href = url;
            link.download = `${tool}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error processing PDF:", error);
            alert(`Error: ${error.response?.data?.error || "Failed to process PDF"}`);
        }
    };

    const renderToolSpecificControls = () => {
        switch (tool) {
            case "protect-pdf":
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Set Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter password"
                        />
                    </div>
                );
            case "unprotect-pdf":
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter password"
                        />
                    </div>
                );
            case "split-pdf":
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Split Pages</label>
                        <input
                            type="text"
                            value={splitPages}
                            onChange={(e) => setSplitPages(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter page numbers (e.g., 1-3, 4, 5-8)"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <main className="container mx-auto max-w-4xl px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                {toolContent.title}
                            </h2>
                            <p className="text-gray-600 mt-2 text-lg">{toolContent.description}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <FileUpload files={files} setFiles={setFiles} fileInputRef={fileInputRef} />
                    </div>

                    {renderToolSpecificControls()}

                    <div className="mt-6 flex justify-end">
                        <button
                            disabled={files.length === 0 || (tool === "protect-pdf" && !password)}
                            onClick={processPDF}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                            Process Files
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
