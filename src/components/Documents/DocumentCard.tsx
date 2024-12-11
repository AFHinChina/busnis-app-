import React from 'react';
import { FileText, Image as ImageIcon, Download, Trash2, Tag, Eye } from 'lucide-react';
import { Document } from '../../types/documents';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { formatFileSize } from '../../utils/fileUtils';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete }) => {
  const [showPreview, setShowPreview] = React.useState(false);

  const renderIcon = () => {
    if (document.fileType === 'image') {
      return <ImageIcon className="h-6 w-6 text-blue-600" />;
    }
    return <FileText className="h-6 w-6 text-blue-600" />;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              {renderIcon()}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{document.name}</h3>
              <p className="text-sm text-gray-500">
                {document.type.toUpperCase()} - {formatFileSize(document.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {document.fileType === 'image' && (
              <button
                onClick={() => setShowPreview(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Eye className="h-5 w-5" />
              </button>
            )}
            <button 
              onClick={() => window.open(document.url, '_blank')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Download className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onDelete(document.id)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {document.thumbnail && (
          <div className="mb-4">
            <img
              src={document.thumbnail}
              alt={document.name}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>تم الرفع: {format(document.uploadDate, 'yyyy/MM/dd', { locale: ar })}</span>
        </div>

        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {document.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {showPreview && document.fileType === 'image' && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
        >
          <div className="max-w-4xl mx-4">
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};