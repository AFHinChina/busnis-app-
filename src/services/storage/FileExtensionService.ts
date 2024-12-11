import { LocalStorageService } from './LocalStorageService';

export interface FileExtensionConfig {
  defaultExtension: string;
  availableExtensions: {
    extension: string;
    name: string;
    description: string;
  }[];
}

export class FileExtensionService {
  private static instance: FileExtensionService;
  private localStorage: LocalStorageService;
  private readonly CONFIG_KEY = 'file_extension_config';

  private readonly DEFAULT_CONFIG: FileExtensionConfig = {
    defaultExtension: '.json',
    availableExtensions: [
      {
        extension: '.json',
        name: 'JSON',
        description: 'تنسيق منظم وسهل القراءة للبيانات'
      },
      {
        extension: '.csv',
        name: 'CSV',
        description: 'تنسيق جدولي يمكن فتحه في برامج الجداول'
      },
      {
        extension: '.xml',
        name: 'XML',
        description: 'تنسيق قابل للتوسع ومدعوم على نطاق واسع'
      }
    ]
  };

  private constructor() {
    this.localStorage = LocalStorageService.getInstance();
  }

  public static getInstance(): FileExtensionService {
    if (!FileExtensionService.instance) {
      FileExtensionService.instance = new FileExtensionService();
    }
    return FileExtensionService.instance;
  }

  public async initialize(): Promise<void> {
    const config = await this.localStorage.getData(this.CONFIG_KEY);
    if (!config) {
      await this.localStorage.saveData(this.CONFIG_KEY, this.DEFAULT_CONFIG);
    }
  }

  public async getConfig(): Promise<FileExtensionConfig> {
    const config = await this.localStorage.getData(this.CONFIG_KEY);
    return config || this.DEFAULT_CONFIG;
  }

  public async setDefaultExtension(extension: string): Promise<void> {
    const config = await this.getConfig();
    if (!config.availableExtensions.some(ext => ext.extension === extension)) {
      throw new Error('امتداد الملف غير مدعوم');
    }
    
    await this.localStorage.saveData(this.CONFIG_KEY, {
      ...config,
      defaultExtension: extension
    });
  }

  public async isFirstUse(): Promise<boolean> {
    const config = await this.localStorage.getData(this.CONFIG_KEY);
    return !config;
  }
}