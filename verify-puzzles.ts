#!/usr/bin/env tsx

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
// This will use Application Default Credentials or service account key
let app;
try {
  // Try to use application default credentials first (for local development with gcloud auth)
  app = initializeApp({
    credential: applicationDefault(),
    projectId: "ranklr-817e2"
  });
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK.');
  console.error('Please either:');
  console.error('1. Run "gcloud auth application-default login" to authenticate');
  console.error('2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable to your service account key file');
  console.error('3. Place your service account key file as "serviceAccountKey.json" in the project root');
  console.error('\nError details:', error);
  process.exit(1);
}

const db = getFirestore(app);

interface ValidationError {
  puzzleId: string;
  field: string;
  issue: string;
  expected?: string;
  actual?: any;
}

class PuzzleValidator {
  private errors: ValidationError[] = [];

  private addError(puzzleId: string, field: string, issue: string, expected?: string, actual?: any) {
    this.errors.push({ puzzleId, field, issue, expected, actual });
  }

  private isValidDateFormat(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString + 'T00:00:00.000Z');
    return date.toISOString().slice(0, 10) === dateString;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private timestampToEasternDate(timestamp: Timestamp): string {
    // Convert timestamp to Eastern Time date
    const date = timestamp.toDate();
    const easternDateString = date.toLocaleDateString('en-US', { 
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // Convert MM/DD/YYYY to YYYY-MM-DD
    const [month, day, year] = easternDateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private isEasternMidnight(timestamp: Timestamp, expectedDate: string): boolean {
    const date = timestamp.toDate();
    
    // Check if it's midnight Eastern Time for the expected date
    const easternDateString = this.timestampToEasternDate(timestamp);
    if (easternDateString !== expectedDate) return false;

    // Check if it's exactly midnight (00:00:00) in Eastern Time
    const easternTimeString = date.toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    return easternTimeString === '00:00:00';
  }

  validatePuzzle(puzzle: any): boolean {
    const puzzleId = puzzle.id || 'unknown';
    let isValid = true;

    // Validate id format
    if (typeof puzzle.id !== 'string') {
      this.addError(puzzleId, 'id', 'Must be a string', 'string', typeof puzzle.id);
      isValid = false;
    } else if (!this.isValidDateFormat(puzzle.id)) {
      this.addError(puzzleId, 'id', 'Must follow YYYY-MM-DD format', 'YYYY-MM-DD', puzzle.id);
      isValid = false;
    }

    // Validate date is a timestamp
    if (!puzzle.date || typeof puzzle.date.toDate !== 'function') {
      this.addError(puzzleId, 'date', 'Must be a Firestore Timestamp', 'Timestamp', typeof puzzle.date);
      isValid = false;
    } else if (typeof puzzle.id === 'string' && this.isValidDateFormat(puzzle.id)) {
      // Check if timestamp matches the ID date and is midnight Eastern
      if (!this.isEasternMidnight(puzzle.date, puzzle.id)) {
        const actualDate = this.timestampToEasternDate(puzzle.date);
        this.addError(puzzleId, 'date', 'Timestamp must be midnight Eastern Time for the date in ID', 
          `${puzzle.id} 00:00:00 ET`, `${actualDate} (or not midnight)`);
        isValid = false;
      }
    }

    // Validate question
    if (typeof puzzle.question !== 'string') {
      this.addError(puzzleId, 'question', 'Must be a string', 'string', typeof puzzle.question);
      isValid = false;
    } else {
      if (!puzzle.question.endsWith('?')) {
        this.addError(puzzleId, 'question', 'Must end with a question mark', 'ends with ?', `ends with '${puzzle.question.slice(-1)}'`);
        isValid = false;
      }
      if (!puzzle.question.includes('5')) {
        this.addError(puzzleId, 'question', 'Must contain the number 5', 'contains "5"', 'does not contain "5"');
        isValid = false;
      }
    }

    // Validate source
    if (typeof puzzle.source !== 'string') {
      this.addError(puzzleId, 'source', 'Must be a string', 'string', typeof puzzle.source);
      isValid = false;
    } else if (!this.isValidUrl(puzzle.source)) {
      this.addError(puzzleId, 'source', 'Must be a valid URL', 'valid URL', puzzle.source);
      isValid = false;
    }

    // Validate sourceDate
    if (typeof puzzle.sourceDate !== 'string') {
      this.addError(puzzleId, 'sourceDate', 'Must be a string', 'string', typeof puzzle.sourceDate);
      isValid = false;
    } else if (!this.isValidDateFormat(puzzle.sourceDate)) {
      this.addError(puzzleId, 'sourceDate', 'Must follow YYYY-MM-DD format', 'YYYY-MM-DD', puzzle.sourceDate);
      isValid = false;
    }

    // Validate possibleAnswers
    if (!Array.isArray(puzzle.possibleAnswers)) {
      this.addError(puzzleId, 'possibleAnswers', 'Must be an array', 'array', typeof puzzle.possibleAnswers);
      isValid = false;
    } else {
      if (puzzle.possibleAnswers.length !== 20) {
        this.addError(puzzleId, 'possibleAnswers', 'Must have exactly 20 items', '20 items', `${puzzle.possibleAnswers.length} items`);
        isValid = false;
      }

      const nonStringAnswers = puzzle.possibleAnswers.filter((item: any) => typeof item !== 'string');
      if (nonStringAnswers.length > 0) {
        this.addError(puzzleId, 'possibleAnswers', 'All items must be strings', 'all strings', `${nonStringAnswers.length} non-string items`);
        isValid = false;
      }

      const uniqueAnswers = new Set(puzzle.possibleAnswers);
      if (uniqueAnswers.size !== puzzle.possibleAnswers.length) {
        this.addError(puzzleId, 'possibleAnswers', 'All items must be unique', '20 unique items', `${uniqueAnswers.size} unique items`);
        isValid = false;
      }
    }

    // Validate correctAnswers
    if (!Array.isArray(puzzle.correctAnswers)) {
      this.addError(puzzleId, 'correctAnswers', 'Must be an array', 'array', typeof puzzle.correctAnswers);
      isValid = false;
    } else {
      if (puzzle.correctAnswers.length !== 5) {
        this.addError(puzzleId, 'correctAnswers', 'Must have exactly 5 items', '5 items', `${puzzle.correctAnswers.length} items`);
        isValid = false;
      }

      const nonStringCorrectAnswers = puzzle.correctAnswers.filter((item: any) => typeof item !== 'string');
      if (nonStringCorrectAnswers.length > 0) {
        this.addError(puzzleId, 'correctAnswers', 'All items must be strings', 'all strings', `${nonStringCorrectAnswers.length} non-string items`);
        isValid = false;
      }

      const uniqueCorrectAnswers = new Set(puzzle.correctAnswers);
      if (uniqueCorrectAnswers.size !== puzzle.correctAnswers.length) {
        this.addError(puzzleId, 'correctAnswers', 'All items must be unique', '5 unique items', `${uniqueCorrectAnswers.size} unique items`);
        isValid = false;
      }

      // Check if all correctAnswers exist in possibleAnswers
      if (Array.isArray(puzzle.possibleAnswers) && Array.isArray(puzzle.correctAnswers)) {
        const possibleSet = new Set(puzzle.possibleAnswers);
        const missingAnswers = puzzle.correctAnswers.filter((answer: string) => !possibleSet.has(answer));
        if (missingAnswers.length > 0) {
          this.addError(puzzleId, 'correctAnswers', 'All items must exist in possibleAnswers', 
            'all in possibleAnswers', `missing: [${missingAnswers.join(', ')}]`);
          isValid = false;
        }
      }
    }

    return isValid;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  clearErrors(): void {
    this.errors = [];
  }
}

async function verifyPuzzles(): Promise<void> {
  try {
    console.log('🔍 Fetching puzzles from Firestore (using Admin SDK)...\n');
    
    const puzzlesRef = db.collection('puzzles');
    const snapshot = await puzzlesRef.get();
    
    if (snapshot.empty) {
      console.log('❌ No puzzles found in the collection.');
      return;
    }

    const validator = new PuzzleValidator();
    const puzzles: any[] = [];
    
    // Collect all puzzles and sort by ID
    snapshot.forEach((doc) => {
      puzzles.push({ id: doc.id, ...doc.data() });
    });
    
    puzzles.sort((a, b) => a.id.localeCompare(b.id));
    
    console.log(`📊 Validating ${puzzles.length} puzzles...\n`);
    
    // Visual progress display
    let validCount = 0;
    let output = '';
    
    for (const puzzle of puzzles) {
      const isValid = validator.validatePuzzle(puzzle);
      if (isValid) {
        validCount++;
        output += '\x1b[32m.\x1b[0m'; // Green dot
      } else {
        output += '\x1b[31mF\x1b[0m'; // Red F
      }
    }
    
    console.log(output);
    console.log('\n');
    
    // Summary
    const totalCount = puzzles.length;
    const failCount = totalCount - validCount;
    
    if (failCount === 0) {
      console.log(`\x1b[32m✅ All ${totalCount} puzzles passed validation!\x1b[0m`);
    } else {
      console.log(`\x1b[31m❌ ${failCount} of ${totalCount} puzzles failed validation.\x1b[0m`);
      console.log(`\x1b[32m✅ ${validCount} puzzles passed.\x1b[0m\n`);
      
      // Detailed error report
      console.log('\x1b[31m📋 DETAILED ERROR REPORT:\x1b[0m\n');
      
      const errors = validator.getErrors();
      const errorsByPuzzle = errors.reduce((acc, error) => {
        if (!acc[error.puzzleId]) {
          acc[error.puzzleId] = [];
        }
        acc[error.puzzleId].push(error);
        return acc;
      }, {} as Record<string, ValidationError[]>);
      
      Object.entries(errorsByPuzzle).forEach(([puzzleId, puzzleErrors]) => {
        console.log(`\x1b[33m🧩 Puzzle: ${puzzleId}\x1b[0m`);
        puzzleErrors.forEach((error, index) => {
          console.log(`   ${index + 1}. \x1b[31m${error.field}\x1b[0m: ${error.issue}`);
          if (error.expected) {
            console.log(`      Expected: \x1b[32m${error.expected}\x1b[0m`);
            console.log(`      Actual: \x1b[31m${error.actual}\x1b[0m`);
          }
        });
        console.log('');
      });
    }
    
    // Exit with appropriate code
    process.exit(failCount > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\x1b[31m❌ Error during verification:\x1b[0m', error);
    process.exit(1);
  }
}

// Run the verification
verifyPuzzles();
