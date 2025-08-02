import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, CircularProgress, Box, Alert } from '@mui/material';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import AttemptsGrid from './components/AttemptsGrid';
import AnswerBank from './components/AnswerBank';
import FeedbackLegend from './components/FeedbackLegend';
import ResultsDialog from './components/ResultsDialog';
import { useTodaysPuzzle } from './hooks/UseTodaysPuzzle';
import type { Guess } from './types/Guess';
import type { GameState } from './types/GameState';
import { today } from './helpers/Dates';

// Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
  },
});

function App() {
  const { data: puzzle, isLoading, error } = useTodaysPuzzle();

  const [gameState, setGameState] = useState<GameState>({
    date: today(),
    currentGuess: [],
    previousGuesses: [],
    attemptsUsed: 0,
    maxAttempts: 5,
    gameComplete: false,
    gameWon: false,
  });

  const [resultsOpen, setResultsOpen] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setGameState(prev => {
      const currentGuess = [...prev.currentGuess];
      const existingIndex = currentGuess.findIndex(a => a === answer);
      
      if (existingIndex >= 0) {
        // Remove if already selected
        currentGuess.splice(existingIndex, 1);
      } else if (currentGuess.length < 5) {
        // Add if not at limit
        currentGuess.push(answer);
      }
      
      return { ...prev, currentGuess };
    });
  };

  const calculateFeedback = (selectedAnswers: string[], correctAnswers: string[]): ('correct' | 'wrong-position' | 'missing')[] => {
    return selectedAnswers.map((answer, index) => {
      const correctPosition = index;
      if (correctAnswers[correctPosition] === answer) {
        return 'correct';
      } else if (correctAnswers.includes(answer)) {
        return 'wrong-position';
      } else {
        return 'missing';
      }
    });
  };

  const handleSubmitGuess = () => {
    if (!puzzle || gameState.currentGuess.length !== 5) return;

    const feedback = calculateFeedback(gameState.currentGuess, puzzle.correctAnswers);

    const newGuess: Guess = {
      id: gameState.attemptsUsed + 1,
      selectedAnswers: [...gameState.currentGuess],
      feedback,
    };

    const allCorrect = feedback.every(f => f === 'correct');
    const newAttemptsUsed = gameState.attemptsUsed + 1;
    const gameComplete = allCorrect || newAttemptsUsed >= gameState.maxAttempts;

    setGameState(prev => ({
      ...prev,
      previousGuesses: [...prev.previousGuesses, newGuess],
      currentGuess: [],
      attemptsUsed: newAttemptsUsed,
      gameComplete,
      gameWon: allCorrect,
    }));

    if (gameComplete) {
      setResultsOpen(true);
    }
  };

  const handleShare = () => {
    if (!puzzle) return;
    
    // Generate emoji result format
    const emojiResult = gameState.previousGuesses.map(guess => 
      guess.feedback.map(f => {
        switch (f) {
          case 'correct': return '🟩';
          case 'wrong-position': return '🟨';
          case 'missing': return '⬜';
          default: return '⬜';
        }
      }).join('')
    ).join('\n');
    
    const shareText = `ranklr.io ${gameState.gameWon ? gameState.attemptsUsed : 'X'}/${gameState.maxAttempts} on ${gameState.date}\n\n${emojiResult}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    } else {
      alert(shareText);
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Header />
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (error || !puzzle) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Header />
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load today's puzzle. Please try again later.
          </Alert>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Header />
        
        <QuestionCard 
          question={puzzle.question}
          description={`Data pulled on ${puzzle.sourceDate}, from ${puzzle.source}`}
        />

        <AttemptsGrid
          previousGuesses={gameState.previousGuesses}
          currentGuess={gameState.currentGuess}
          attemptsUsed={gameState.attemptsUsed}
          maxAttempts={gameState.maxAttempts}
          onSubmitGuess={handleSubmitGuess}
          canSubmit={gameState.currentGuess.length === 5 && !gameState.gameComplete}
          gameComplete={gameState.gameComplete}
          onShare={handleShare}
        />

        <AnswerBank
          possibleAnswers={puzzle.possibleAnswers}
          selectedAnswers={gameState.currentGuess}
          onAnswerSelect={handleAnswerSelect}
          disabled={gameState.gameComplete}
          previousGuesses={gameState.previousGuesses}
        />

        <FeedbackLegend />

        <ResultsDialog
          open={resultsOpen}
          gameWon={gameState.gameWon}
          attemptsUsed={gameState.attemptsUsed}
          maxAttempts={gameState.maxAttempts}
          correctAnswers={puzzle.correctAnswers}
          onClose={() => setResultsOpen(false)}
          onShare={handleShare}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
