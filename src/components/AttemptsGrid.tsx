import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
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
          p: 2,
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          minHeight: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          boxShadow: isCurrent ? `0 0 8px ${theme.palette.primary.main}40` : 'none',
          color: feedback || isCurrent ? 'white' : theme.palette.text.primary,
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
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {['1st', '2nd', '3rd', '4th', '5th'].map((label) => (
            <Grid item xs key={label}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                textAlign="center"
                fontWeight="bold"
              >
                {label}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Previous Attempts */}
        {Array.from({ length: maxAttempts }, (_, attemptIndex) => {
          const guess = previousGuesses[attemptIndex];
          const isCurrentAttempt = attemptIndex === attemptsUsed && currentGuess.length > 0;
          
          return (
            <Grid container spacing={1} key={attemptIndex} sx={{ mb: 1 }}>
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
                  <Grid item xs key={positionIndex}>
                    {renderPositionCell(answer, feedback, isCurrentAttempt)}
                  </Grid>
                );
              })}
            </Grid>
          );
        })}

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
