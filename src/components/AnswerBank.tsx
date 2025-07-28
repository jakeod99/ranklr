import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

interface AnswerBankProps {
  possibleAnswers: readonly string[];
  selectedAnswers: string[];
  onAnswerSelect: (answer: string) => void;
  disabled: boolean;
}

const AnswerBank: React.FC<AnswerBankProps> = ({
  possibleAnswers,
  selectedAnswers,
  onAnswerSelect,
  disabled
}) => {
  const isSelected = (answer: string) => 
    selectedAnswers.includes(answer);
  
  const getSelectedPosition = (answer: string) => {
    const index = selectedAnswers.findIndex(selected => selected === answer);
    return index >= 0 ? index + 1 : null;
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
                  backgroundColor: selected ? 'primary.main' : 'grey.800',
                  color: selected ? 'primary.contrastText' : 'text.primary',
                  border: `1px solid ${selected ? 'transparent' : 'grey.600'}`,
                  cursor: disabled ? 'default' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                  '&:hover': {
                    backgroundColor: disabled ? undefined : 
                                   selected ? 'primary.dark' : 'grey.700',
                  },
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
