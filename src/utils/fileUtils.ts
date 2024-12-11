import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
};

export const getFileType = (file: File): 'image' | 'document' | 'other' => {
  if (file.type.startsWith('image/')) return 'image';
  if (
    file.type === 'application/pdf' ||
    file.type.includes('word') ||
    file.type.includes('excel') ||
    file.type.includes('spreadsheet')
  ) {
    return 'document';
  }
  return 'other';
};

export const generateThumbnail = async (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    return '';
  }

  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 200,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return URL.createObjectURL(compressedFile);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return '';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};