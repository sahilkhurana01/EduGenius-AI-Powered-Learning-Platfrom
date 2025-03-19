import React, { useState, useEffect } from 'react';

const PdfViewer = ({ pdfUrl, fileName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileExists, setFileExists] = useState(false);

  // Check if the file exists without trying to load the PDF
  useEffect(() => {
    async function checkFile() {
      try {
        setLoading(true);
        const response = await fetch(pdfUrl, { method: 'HEAD' });
        
        if (!response.ok) {
          throw new Error(`File not found: ${response.status} ${response.statusText}`);
        }
        
        setFileExists(true);
      } catch (err) {
        console.error("Error checking file:", err);
        setError(`Could not access file: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    
    checkFile();
  }, [pdfUrl]);

  function handleDownload() {
    // Direct download using a temporary link
    try {
      // Create an anchor element and set its properties for downloading
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', fileName || 'document.pdf');
      link.setAttribute('target', '_blank');
      link.style.display = 'none';
      
      // Append to the document, click and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error("Download error:", err);
      // Fallback - open in new tab if download attribute is not supported
      window.open(pdfUrl, '_blank');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-auto flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-800 truncate">{fileName}</h3>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        {/* File Preview / Download Area */}
        <div className="p-8 flex flex-col items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                <p>{error}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gray-100 p-8 rounded-lg mb-6 flex flex-col items-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{fileName}</h3>
                <p className="text-gray-500 mb-6">The file is ready to download</p>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-sm transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download File
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Due to browser limitations, the PDF preview is not available.
                Please download the file to view it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer; 