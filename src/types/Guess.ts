export interface Guess {
  id: number;
  selectedAnswers: string[]; // Array of 5 selected answer strings
  feedback: ('correct' | 'wrong-position' | 'missing')[];
}
