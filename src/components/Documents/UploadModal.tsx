import React, { useState, useRef } from 'react';
import { Upload, Tag, Plus, XCircle } from 'lucide-react';
import { Document } from '../../types/documents';
import { FilePreview } from './FilePreview';
import { Modal } from '../UI/Modal';
import { compressImage, getFileType, generateThumbnail } from '../../utils/fileUtils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: Omit<Document, 'id'>, file: File) => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Document['category']>('other');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'document' | 'other'>('other');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const type = getFileType(file);
    setFileType(type);

    if (type === 'image') {
      const compressedFile = await compressImage(file);
      const thumb = await generateThumbnail(file);
      setThumbnail(thumb);
      setSelectedFile(compressedFile);
    } else {
      setSelectedFile(file);
    }

    setName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setIsSubmitting(true);
    try {
      const newDocument: Omit<Document, 'id'> = {
        name,
        type: selectedFile.type,
        size: selectedFile.size,
        category,
        uploadDate: new Date(),
        tags,
        url: '',
        thumbnail: thumbnail || undefined,
        fileType,
      };

      await onUpload(newDocument, selectedFile);
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="رفع مستند جديد"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المستند
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفئة
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Document['category'])}
            className="w-full border rounded-lg p-2"
          >
            <option value="invoice">فاتورة</option>
            <option value="receipt">إيصال</option>
            <option value="contract">عقد</option>
            <option value="report">تقرير</option>
            <option value="image">صورة</option>
            <option value="other">أخرى</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوسوم
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 border rounded-lg p-2"
              placeholder="أضف وسماً"
            />
            <button
              type="button"
              onClick={addTag}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                <Tag className="h-3 w-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-600"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedFile ? (
            <FilePreview
              file={selectedFile}
              thumbnail={thumbnail}
              fileType={fileType}
            />
          ) : (
            <div className="py-8">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                اسحب وأفلت الملف هنا أو اضغط للاختيار
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!selectedFile || isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الرفع...' : 'رفع المستند'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Modal>
  );
};