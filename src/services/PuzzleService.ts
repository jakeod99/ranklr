// services/puzzleService.ts
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/Firebase';
import type { PuzzleData } from '../types/PuzzleData';

export class PuzzleService {
  private static COLLECTION_NAME = 'puzzles';

  static async getTodaysPuzzle(): Promise<PuzzleData | null> {
    const today_arr = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' }).split("/");
    const today = `${today_arr[2]}-${today_arr[0].padStart(2, "0")}-${today_arr[1].padStart(2, "0")}`;
    const puzzleData = await PuzzleService.getPuzzleByDate(today);
    return puzzleData;
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
