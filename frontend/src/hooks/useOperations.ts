import { useQuery } from '@tanstack/react-query';
import { fetchImportBatches } from '../api/operations';

export const useImportBatches = () =>
  useQuery({
    queryKey: ['importBatches'],
    queryFn: fetchImportBatches,
    staleTime: 5 * 60 * 1000
  });
