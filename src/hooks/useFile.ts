import { useState } from 'react';

interface UseFileOptions {
  maxSize?: number;
  allowedExtensions?: string[];
  onSuccess?: (file: File) => void;
  onError?: (error: string) => void;
}

export const useFile = ({
  maxSize = 10 * 1024 * 1024, // 10MB default
  allowedExtensions = [],
  onSuccess,
  onError
}: UseFileOptions = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      const error = `حجم الملف كبير جداً. الحد الأقصى هو ${formatFileSize(maxSize)}`;
      setError(error);
      onError?.(error);
      return false;
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(`.${fileExtension}`)) {
        const error = `نوع الملف غير مدعوم. الأنواع المدعومة: ${allowedExtensions.join(', ')}`;
        setError(error);
        onError?.(error);
        return false;
      }
    }

    return true;
  };

  const handleFile = async (file: File) => {
    setError(null);
    setIsLoading(true);

    try {
      if (validateFile(file)) {
        setFile(file);
        onSuccess?.(file);
      }
    } catch (err: any) {
      const error = err.message || 'حدث خطأ أثناء معالجة الملف';
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return {
    file,
    error,
    isLoading,
    handleFile,
    clearFile,
    formatFileSize
  };
};