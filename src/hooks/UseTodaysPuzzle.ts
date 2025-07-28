import { useQuery } from '@tanstack/react-query';
import { PuzzleService } from '../services/PuzzleService';
import type { PuzzleData } from '../types/PuzzleData';

export function useTodaysPuzzle() {
  return useQuery<PuzzleData | null, Error>({
    queryKey: ['puzzle', 'today'],
    queryFn: PuzzleService.getTodaysPuzzle,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}

export function usePuzzleByDate(date: string) {
  return useQuery<PuzzleData | null, Error>({
    queryKey: ['puzzle', date],
    queryFn: () => PuzzleService.getPuzzleByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (puzzles don't change)
  });
}
