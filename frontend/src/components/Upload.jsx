import React, { useState, useRef } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { uploadPdf } from '../api/api';
import { useDocuments } from '../context/DocumentContext';
import toast from 'react-hot-toast';

export const Upload = () => {
  const { documents, fetchDocuments, toggleDocumentSelection } = useDocuments();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (!uploading) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported.');
      return;
    }

    // Check for duplicate PDF based on file name
    const isDuplicate = documents.some(doc => doc.fileName === file.name);
    if (isDuplicate) {
      toast.error('This document has already been uploaded.');
      return;
    }

    setUploading(true);
    setProgress(0);
    
    // Create a fake progress interval since standard axios progress might not be perfectly supported by the backend multer setup
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 20, 90));
    }, 500);

    try {
      const response = await uploadPdf(file);
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success('Document uploaded successfully!');
      await fetchDocuments(); 
      
      // Auto-select the newly uploaded document
      if (response && response.documentId) {
        toggleDocumentSelection(response.documentId);
      }
    } catch (error) {
      clearInterval(progressInterval);
      if (error?.response?.status === 409) {
        toast.error('This document has already been uploaded.');
      } else {
        toast.error('Upload failed. Please try again.');
      }
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 500);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : uploading 
              ? 'border-gray-700 bg-gray-800 cursor-not-allowed'
              : 'border-gray-600 hover:border-gray-400 hover:bg-gray-800'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="w-full flex flex-col items-center">
            <p className="text-xs text-blue-400 mb-2 font-medium">Uploading... {Math.round(progress)}%</p>
            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <FiUploadCloud className="text-xl text-gray-300" />
            </div>
            <div className="text-left">
              <p className="text-[13px] text-gray-200 font-medium">Upload PDF</p>
              <p className="text-[11px] text-gray-500">Drag & drop or click</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
