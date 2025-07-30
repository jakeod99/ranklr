import type { Guess } from "./Guess";

export interface GameState {
  date: string;
  currentGuess: string[]; // Array of selected answer strings (max 5)
  previousGuesses: Guess[];
  attemptsUsed: number;
  maxAttempts: number;
  gameComplete: boolean;
  gameWon: boolean;
}
