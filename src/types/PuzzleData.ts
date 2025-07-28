import type { Timestamp } from "firebase/firestore";

export interface PuzzleData {
  id: string;
  date: Timestamp;
  question: string;
  source: string;
  sourceDate: string;
  possibleAnswers: [
    string, string, string, string, string,
    string, string, string, string, string,
    string, string, string, string, string,
    string, string, string, string, string
  ];
  correctAnswers: [
    string, string, string, string, string
  ];
}
