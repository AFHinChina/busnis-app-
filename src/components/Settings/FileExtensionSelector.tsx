import React, { useState, useEffect } from 'react';
import { FileExtensionService, FileExtensionConfig } from '../../services/storage/FileExtensionService';
import { AlertCircle, Check } from 'lucide-react';

interface FileExtensionSelectorProps {
  isFirstUse?: boolean;
  onSelect?: () => void;
}

export const FileExtensionSelector: React.FC<FileExtensionSelectorProps> = ({
  isFirstUse = false,
  onSelect
}) => {
  const [config, setConfig] = useState<FileExtensionConfig | null>(null);
  const [selectedExtension, setSelectedExtension] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const extensionService = FileExtensionService.getInstance();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await extensionService.getConfig();
      setConfig(config);
      setSelectedExtension(config.defaultExtension);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleExtensionSelect = async (extension: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await extensionService.setDefaultExtension(extension);
      setSelectedExtension(extension);
      onSelect?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!config) return null;

  return (
    <div className={`bg-white ${isFirstUse ? 'p-8 rounded-2xl shadow-xl max-w-2xl mx-auto' : ''}`}>
      {isFirstUse && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">اختيار امتداد الملف</h2>
          <p className="text-gray-600">
            اختر امتداد الملف المفضل لديك لحفظ البيانات. يمكنك تغيير هذا الإعداد لاحقاً من صفحة الإعدادات.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4">
        {config.availableExtensions.map((ext) => (
          <button
            key={ext.extension}
            onClick={() => handleExtensionSelect(ext.extension)}
            disabled={isLoading}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedExtension === ext.extension
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{ext.name}</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {ext.extension}
                  </code>
                </div>
                <p className="text-sm text-gray-600 mt-1">{ext.description}</p>
              </div>
              {selectedExtension === ext.extension && (
                <Check className="h-5 w-5 text-blue-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      {isFirstUse && (
        <div className="mt-8 text-center">
          <button
            onClick={() => onSelect?.()}
            disabled={!selectedExtension || isLoading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            متابعة
          </button>
        </div>
      )}
    </div>
  );
};