import React, { useRef, useState } from 'react';
import { Upload, File, X, Check } from 'lucide-react';

interface FileSelectorProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  className?: string;
  label?: string;
  allowedExtensions?: string[];
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  onFileSelect,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  className = '',
  label = 'اختر ملفاً',
  allowedExtensions = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      setError(`حجم الملف كبير جداً. الحد الأقصى هو ${formatFileSize(maxSize)}`);
      return false;
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
        setError(`نوع الملف غير مدعوم. الأنواع المدعومة: ${allowedExtensions.join(', ')}`);
        return false;
      }
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    const file = files[0];

    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }

    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    setError(null);
    const file = files[0];

    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : selectedFile
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {selectedFile ? (
            <>
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-8 w-8" />
                <span className="font-medium">تم اختيار الملف</span>
              </div>
              <div className="text-sm text-gray-600">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </div>
              <button
                onClick={clearSelection}
                className="text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                <span>إزالة</span>
              </button>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400" />
              <div className="text-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {label}
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  أو اسحب وأفلت الملف هنا
                </p>
                {allowedExtensions.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    الأنواع المدعومة: {allowedExtensions.join(', ')}
                  </p>
                )}
                {maxSize && (
                  <p className="text-xs text-gray-400">
                    الحد الأقصى للحجم: {formatFileSize(maxSize)}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="absolute inset-x-0 -bottom-6 text-center">
            <span className="text-sm text-red-600 bg-white px-2">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};