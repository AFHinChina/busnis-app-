import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorsService } from '../services/firebase/vendorsService';
import { Vendor } from '../types/finance';

export const useVendors = () => {
  const queryClient = useQueryClient();

  const vendorsQuery = useQuery({
    queryKey: ['vendors'],
    queryFn: vendorsService.getAll,
    initialData: [],
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const createVendor = useMutation({
    mutationFn: async (vendor: Omit<Vendor, 'id'>) => {
      try {
        return await vendorsService.create(vendor);
      } catch (error) {
        console.error('Error creating vendor:', error);
        throw new Error('فشل إنشاء المورد. يرجى المحاولة مرة أخرى.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    }
  });

  return {
    vendors: vendorsQuery.data,
    isLoading: vendorsQuery.isLoading,
    isError: vendorsQuery.isError,
    createVendor
  };
};