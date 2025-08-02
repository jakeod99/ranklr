import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { Guess } from '../types/Guess';

interface AnswerBankProps {
  possibleAnswers: readonly string[];
  selectedAnswers: string[];
  onAnswerSelect: (answer: string) => void;
  disabled: boolean;
  previousGuesses: Guess[];
}

const AnswerBank: React.FC<AnswerBankProps> = ({
  possibleAnswers,
  selectedAnswers,
  onAnswerSelect,
  disabled,
  previousGuesses
}) => {
  const theme = useTheme();
  
  const isSelected = (answer: string) => 
    selectedAnswers.includes(answer);
  
  const getSelectedPosition = (answer: string) => {
    const index = selectedAnswers.findIndex(selected => selected === answer);
    return index >= 0 ? index + 1 : null;
  };

  // Get the best feedback for an answer across all previous guesses
  const getBestFeedback = (answer: string): 'correct' | 'wrong-position' | 'missing' | null => {
    let bestFeedback: 'correct' | 'wrong-position' | 'missing' | null = null;
    
    for (const guess of previousGuesses) {
      const answerIndex = guess.selectedAnswers.findIndex(selected => selected === answer);
      if (answerIndex >= 0) {
        const feedback = guess.feedback[answerIndex];
        
        // Prioritize feedback: correct > wrong-position > missing
        if (feedback === 'correct') {
          return 'correct'; // Best possible, no need to check further
        } else if (feedback === 'wrong-position') {
          bestFeedback = 'wrong-position';
        } else if (feedback === 'missing' && bestFeedback === null) {
          bestFeedback = 'missing';
        }
      }
    }
    
    return bestFeedback;
  };

  const getChipStyles = (answer: string, selected: boolean) => {
    if (selected) {
      return {
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        border: '1px solid transparent',
      };
    }

    const feedback = getBestFeedback(answer);
    
    switch (feedback) {
      case 'correct':
        return {
          backgroundColor: theme.palette.success.main,
          color: 'white',
          border: `1px solid ${theme.palette.success.main}`,
        };
      case 'wrong-position':
        return {
          backgroundColor: theme.palette.warning.main,
          color: 'white',
          border: `1px solid ${theme.palette.warning.main}`,
        };
      case 'missing':
        return {
          backgroundColor: theme.palette.grey[600],
          color: 'white',
          border: `1px solid ${theme.palette.grey[600]}`,
        };
      default:
        return {
          backgroundColor: 'grey.800',
          color: 'text.primary',
          border: '1px solid grey.600',
        };
    }
  };

  const getHoverStyles = (answer: string, selected: boolean) => {
    if (disabled) return {};
    
    if (selected) {
      return { backgroundColor: 'primary.dark' };
    }

    const feedback = getBestFeedback(answer);
    
    switch (feedback) {
      case 'correct':
        return { backgroundColor: theme.palette.success.dark };
      case 'wrong-position':
        return { backgroundColor: theme.palette.warning.dark };
      case 'missing':
        return { backgroundColor: theme.palette.grey[700] };
      default:
        return { backgroundColor: 'grey.900' };
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Available Options
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {possibleAnswers.map((answer, index) => {
            const selected = isSelected(answer);
            const position = getSelectedPosition(answer);
            
            return (
              <Chip
                key={index}
                label={selected ? `${answer} (${position})` : answer}
                onClick={() => !disabled && onAnswerSelect(answer)}
                sx={{
                  ...getChipStyles(answer, selected),
                  cursor: disabled ? 'default' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                  '&:hover': getHoverStyles(answer, selected),
                }}
                disabled={disabled}
              />
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnswerBank;
