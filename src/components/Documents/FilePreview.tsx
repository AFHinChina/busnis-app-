import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  thumbnail?: string;
  fileType: 'image' | 'document' | 'other';
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, thumbnail, fileType }) => {
  if (fileType === 'image' && thumbnail) {
    return (
      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={thumbnail}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 rounded-lg">
      {fileType === 'document' ? (
        <FileText className="h-16 w-16 text-gray-400" />
      ) : (
        <ImageIcon className="h-16 w-16 text-gray-400" />
      )}
      <p className="mt-2 text-sm text-gray-600">{file.name}</p>
    </div>
  );
};