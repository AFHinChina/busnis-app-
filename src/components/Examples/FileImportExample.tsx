import React from 'react';
import { FileSelector } from '../UI/FileSelector';
import { useFile } from '../../hooks/useFile';

export const FileImportExample: React.FC = () => {
  const { handleFile, error, file, isLoading } = useFile({
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
    onSuccess: (file) => {
      console.log('File selected:', file);
      // Handle file processing here
    },
    onError: (error) => {
      console.error('File error:', error);
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">استيراد ملف</h2>
      
      <FileSelector
        onFileSelect={handleFile}
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        maxSize={5 * 1024 * 1024}
        allowedExtensions={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
        label="اختر ملفاً للاستيراد"
        className="max-w-xl mx-auto"
      />

      {isLoading && (
        <div className="mt-4 text-center text-gray-600">
          جاري معالجة الملف...
        </div>
      )}

      {error && (
        <div className="mt-4 text-center text-red-600">
          {error}
        </div>
      )}

      {file && !error && (
        <div className="mt-4 text-center text-green-600">
          تم اختيار الملف بنجاح: {file.name}
        </div>
      )}
    </div>
  );
};