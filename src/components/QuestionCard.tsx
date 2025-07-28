import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface QuestionCardProps {
  question: string;
  description: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, description }) => {
  return (
    <Card sx={{ mb: 3, textAlign: 'center' }}>
      <CardContent sx={{ py: 3 }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ mb: 1, fontWeight: 'medium' }}
        >
          {question}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
