import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersService } from '../services/firebase/customersService';
import { Customer } from '../types/finance';

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: customersService.getAll,
    initialData: [],
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const createCustomer = useMutation({
    mutationFn: async (customer: Omit<Customer, 'id'>) => {
      try {
        return await customersService.create(customer);
      } catch (error) {
        console.error('Error creating customer:', error);
        throw new Error('فشل إنشاء العميل. يرجى المحاولة مرة أخرى.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  return {
    customers: customersQuery.data,
    isLoading: customersQuery.isLoading,
    isError: customersQuery.isError,
    createCustomer
  };
};