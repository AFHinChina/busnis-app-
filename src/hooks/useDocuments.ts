import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService } from '../services/firebase/documentsService';
import { Document } from '../types/documents';

export const useDocuments = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsService.getAll
  });

  const addDocumentMutation = useMutation({
    mutationFn: async ({ document, file }: { document: Omit<Document, 'id'>, file: File }) => {
      return documentsService.create(document, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: documentsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery ? 
      (doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) : true;
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const addDocument = async (document: Omit<Document, 'id'>, file: File) => {
    await addDocumentMutation.mutateAsync({ document, file });
  };

  const deleteDocument = async (id: string) => {
    await deleteDocumentMutation.mutateAsync(id);
  };

  return {
    documents: filteredDocuments,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addDocument,
    deleteDocument,
    isLoading: addDocumentMutation.isPending || deleteDocumentMutation.isPending
  };
};