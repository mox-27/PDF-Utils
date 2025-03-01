import { useParams } from 'react-router-dom';
import FileUpload from './FileUpload';
import { useRef, useState } from 'react';

export const Tool = () => {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const { tool } = useParams();

    const getToolContent = () => {
        switch (tool) {
            case 'merge-pdf':
                return {
                    title: 'Merge PDFs',
                    description: 'Upload PDFs to merge them into a single file.',
                };
            case 'split-pdf':
                return {
                    title: 'Split PDF',
                    description: 'Split your PDF into multiple files.',
                };
            case 'compress-pdf':
                return {
                    title: 'Compress PDF',
                    description: 'Reduce PDF file size while maintaining quality.',
                };
            default:
                return {
                    title: 'PDF Tool',
                    description: 'Select a tool to get started.',
                };
        }
    };

    const toolContent = getToolContent();

    const proceesPDF = async (e) => {
        e.preventDefault();
        console.log(files);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <main className="container mx-auto max-w-4xl px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                {toolContent.title}
                            </h2>
                            <p className="text-gray-600 mt-2 text-lg">
                                {toolContent.description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <FileUpload 
                            files={files} 
                            setFiles={setFiles} 
                            fileInputRef={fileInputRef}
                        />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button
                            disabled={files.length === 0}
                            onClick={proceesPDF}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Process Files
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};