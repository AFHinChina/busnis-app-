import React, { useState } from 'react';
import { PlusCircle, Search, FileText, Ship } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentCard } from '../components/Documents/DocumentCard';
import { ShippingDocumentCard } from '../components/Documents/ShippingDocumentCard';
import { UploadModal } from '../components/Documents/UploadModal';
import { ShippingDocumentForm } from '../components/Documents/ShippingDocumentForm';

export const Documents: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const {
    documents,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addDocument,
    deleteDocument,
  } = useDocuments();

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المستندات</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowShippingForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Ship className="h-5 w-5" />
            <span className="font-medium">بوليصة شحن</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="font-medium">رفع مستند</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute right-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في المستندات..."
                className="w-full pr-10 py-2 px-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="border rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">جميع الفئات</option>
            <option value="shipping">مستندات الشحن</option>
            <option value="invoice">فواتير</option>
            <option value="receipt">إيصالات</option>
            <option value="contract">عقود</option>
            <option value="report">تقارير</option>
            <option value="other">أخرى</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documents.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
            <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg mb-4">لا توجد مستندات</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowShippingForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <Ship className="h-5 w-5" />
                إضافة بوليصة شحن
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                رفع مستند جديد
              </button>
            </div>
          </div>
        ) : (
          documents.map((document) => (
            document.type === 'shipping' ? (
              <ShippingDocumentCard
                key={document.id}
                document={document}
                onDelete={deleteDocument}
              />
            ) : (
              <DocumentCard
                key={document.id}
                document={document}
                onDelete={deleteDocument}
              />
            )
          ))
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={addDocument}
      />

      {/* Shipping Document Form */}
      {showShippingForm && (
        <ShippingDocumentForm
          onSubmit={(data) => {
            addDocument({
              ...data,
              type: 'shipping',
              uploadDate: new Date(),
            });
            setShowShippingForm(false);
          }}
          onClose={() => setShowShippingForm(false)}
        />
      )}
    </div>
  );
};