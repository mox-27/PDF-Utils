import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faCut, faLock, faUnlock, faImages, faCompress } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
export const Home = () => {
    const utilities = [
        { title: 'Merge PDF', description: 'Combine multiple PDFs into one document', icon: faFilePdf, url:'merge-pdf' },
        { title: 'Split PDF', description: 'Separate one PDF into multiple files', icon: faCut , url:'split-pdf' },
        { title: 'Protect PDF', description: 'Secure your PDF with password', icon: faLock , url:'protect-pdf' },
        { title: 'Unprotect PDF', description: 'Remove password protection from PDF', icon: faUnlock , url:'unprotect-pdf' },
        { title: 'Image to PDF', description: 'Convert images to PDF format', icon: faImages , url:'image-to-pdf' },
        { title: 'Compress PDF', description: 'Reduce PDF file size', icon: faCompress , url:'compress-pdf' }
    ];

    return (
        <main className="container mx-auto mt-8 p-6">
            <h2 className="text-blue-500 text-3xl font-bold text-center mb-8">Welcome to PDF Utils</h2>
            <p className="text-gray-600 text-center mb-12">Manage your PDFs with our easy-to-use tools</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {utilities.map((util, index) => (
                    <Link to={`/${util.url.toLowerCase().replace(' ', '-')}`} className="hover:no-underline">
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                            <FontAwesomeIcon icon={util.icon} className="text-4xl mb-4 text-blue-700" />
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">{util.title}</h3>
                            <p className="text-gray-600">{util.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}