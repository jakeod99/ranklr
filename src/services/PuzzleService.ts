// services/puzzleService.ts
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/Firebase';
import type { PuzzleData } from '../types/PuzzleData';
import { today } from '../helpers/Dates'

export class PuzzleService {
  private static COLLECTION_NAME = 'puzzles';

  static async getTodaysPuzzle(): Promise<PuzzleData | null> {
    return await PuzzleService.getPuzzleByDate(today());
  }

  static async getPuzzleByDate(date: string): Promise<PuzzleData | null> {
    try {
      const puzzleRef = doc(db, this.COLLECTION_NAME, date);
      const puzzleSnap = await getDoc(puzzleRef);

      if (puzzleSnap.exists()) {
        const data = puzzleSnap.data();
        return data as PuzzleData;
      }

      return null;
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      return null;
    }
  }
}
