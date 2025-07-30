import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  useTheme 
} from '@mui/material';
import type { Guess } from '../types/Guess';

interface AttemptsGridProps {
  previousGuesses: Guess[];
  currentGuess: string[];
  attemptsUsed: number;
  maxAttempts: number;
  onSubmitGuess: () => void;
  canSubmit: boolean;
}

const AttemptsGrid: React.FC<AttemptsGridProps> = ({
  previousGuesses,
  currentGuess,
  attemptsUsed,
  maxAttempts,
  onSubmitGuess,
  canSubmit
}) => {
  const theme = useTheme();

  const getBackgroundColor = (feedback: string) => {
    switch (feedback) {
      case 'correct': return theme.palette.success.main;
      case 'wrong-position': return theme.palette.warning.main;
      case 'missing': return theme.palette.grey[600];
      default: return theme.palette.grey[800];
    }
  };

  const renderPositionCell = (answer?: string, feedback?: string, isCurrentGuess = false) => {
    const isEmpty = !answer;
    const isCurrent = isCurrentGuess && !isEmpty;
    
    return (
      <Box
        sx={{
          backgroundColor: feedback ? getBackgroundColor(feedback) : 
                          isCurrent ? theme.palette.grey[700] : 
                          theme.palette.grey[800],
          border: `2px solid ${
            isCurrent ? theme.palette.primary.main : 
            feedback ? 'transparent' : 
            theme.palette.grey[600]
          }`,
          borderRadius: 1,
          p: { xs: 0.5, sm: 1 },
          textAlign: 'center',
          fontSize: { xs: '0.7rem', sm: '0.875rem' },
          fontWeight: 'bold',
          minHeight: { xs: 45, sm: 60 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          boxShadow: isCurrent ? `0 0 8px ${theme.palette.primary.main}40` : 'none',
          color: feedback || isCurrent ? 'white' : theme.palette.text.primary,
          // Ensure content wraps within cell without changing cell dimensions
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          lineHeight: 1.1,
        }}
      >
        {answer || ''}
      </Box>
    );
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Attempts{' '}
          <Typography component="span" color="text.secondary" fontSize="0.875rem">
            ({attemptsUsed}/{maxAttempts})
          </Typography>
        </Typography>

        {/* Position Labels */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: { xs: 0.5, sm: 1 },
            mb: 2,
          }}
        >
          {['1st', '2nd', '3rd', '4th', '5th'].map((label, index) => (
            <Box
              key={index}
              sx={{
                textAlign: 'center',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                color: 'text.secondary',
                fontWeight: 'bold',
              }}
            >
              {label}
            </Box>
          ))}
        </Box>

        {/* Attempts Grid - Fixed CSS Grid Layout */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: `repeat(${maxAttempts}, 1fr)`,
            gap: { xs: 0.5, sm: 1 },
            mb: 3,
          }}
        >
          {Array.from({ length: maxAttempts }, (_, attemptIndex) => {
            const guess = previousGuesses[attemptIndex];
            const isCurrentAttempt = attemptIndex === attemptsUsed && currentGuess.length > 0;
            
            return (
              <Box
                key={attemptIndex}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                {Array.from({ length: 5 }, (_, positionIndex) => {
                  let answer: string | undefined;
                  let feedback: string | undefined;
                  
                  if (guess) {
                    answer = guess.selectedAnswers[positionIndex];
                    feedback = guess.feedback[positionIndex];
                  } else if (isCurrentAttempt) {
                    answer = currentGuess[positionIndex];
                  }
                  
                  return (
                    <Box key={positionIndex}>
                      {renderPositionCell(answer, feedback, isCurrentAttempt)}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, py: 2, fontSize: '1rem' }}
          disabled={!canSubmit}
          onClick={onSubmitGuess}
        >
          Submit Guess
        </Button>
      </CardContent>
    </Card>
  );
};

export default AttemptsGrid;
