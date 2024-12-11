export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'invoice' | 'receipt' | 'contract' | 'report' | 'image' | 'other';
  uploadDate: Date;
  tags: string[];
  url: string;
  thumbnail?: string;
  fileType: 'image' | 'document' | 'other';
}

export interface DocumentCategory {
  id: 'invoice' | 'receipt' | 'contract' | 'report' | 'image' | 'other';
  name: string;
  icon: string;
  color: string;
}