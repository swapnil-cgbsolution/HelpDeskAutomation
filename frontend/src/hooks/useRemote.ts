import { useQuery } from '@tanstack/react-query';
import { fetchApprovals, fetchRemoteSessions, fetchRoster } from '../api/operations';

export const useRemoteSessions = () =>
  useQuery({
    queryKey: ['remoteSessions'],
    queryFn: fetchRemoteSessions,
    staleTime: 30 * 1000
  });

export const useApprovals = () =>
  useQuery({
    queryKey: ['approvals'],
    queryFn: fetchApprovals,
    staleTime: 30 * 1000
  });

export const useRoster = () =>
  useQuery({
    queryKey: ['roster'],
    queryFn: fetchRoster,
    staleTime: 60 * 1000
  });
