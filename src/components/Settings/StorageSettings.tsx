import React, { useState, useEffect } from 'react';
import { FolderOpen, Download, Upload, RefreshCw, AlertCircle } from 'lucide-react';
import { StorageConfigService } from '../../services/storage/StorageConfigService';
import { DataMigrationService } from '../../services/migration/DataMigrationService';

export const StorageSettings: React.FC = () => {
  const [dataPath, setDataPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [migrationProgress, setMigrationProgress] = useState(0);

  const storageConfig = StorageConfigService.getInstance();
  const migrationService = DataMigrationService.getInstance();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = storageConfig.getConfig();
      setDataPath(config.dataPath);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSelectFolder = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // In a web environment, we'll use a text input instead
      const newPath = prompt('Enter data storage path:', dataPath);
      if (newPath && newPath !== dataPath) {
        await storageConfig.setDataPath(newPath);
        setDataPath(newPath);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const blob = await migrationService.exportData();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `data_backup_${new Date().toISOString()}.dat`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setIsLoading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      await migrationService.importData(file);
      
      // Monitor progress
      const interval = setInterval(() => {
        const progress = migrationService.getProgress();
        setMigrationProgress(progress.current);
        
        if (progress.status === 'completed' || progress.status === 'failed') {
          clearInterval(interval);
          if (progress.status === 'failed') {
            setError(progress.error || 'Import failed');
          }
        }
      }, 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">إعدادات التخزين</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Data Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            موقع تخزين البيانات
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={dataPath}
              readOnly
              className="flex-1 border rounded-lg px-3 py-2 bg-gray-50"
            />
            <button
              onClick={handleSelectFolder}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <FolderOpen className="h-5 w-5" />
              <span>تحديد المجلد</span>
            </button>
          </div>
        </div>

        {/* Data Migration */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">نقل البيانات</h3>
          
          <div className="flex gap-4">
            <button
              onClick={handleExportData}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              <span>تصدير البيانات</span>
            </button>

            <label className="flex-1">
              <input
                type="file"
                accept=".dat"
                onChange={handleImportData}
                className="hidden"
              />
              <div className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="h-5 w-5" />
                <span>استيراد البيانات</span>
              </div>
            </label>
          </div>

          {migrationProgress > 0 && migrationProgress < 100 && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${migrationProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                جاري نقل البيانات... {migrationProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Maintenance */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">الصيانة</h3>
          
          <button
            onClick={() => storageConfig.cleanup()}
            disabled={isLoading}
            className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>تنظيف البيانات القديمة</span>
          </button>
        </div>
      </div>
    </div>
  );
};