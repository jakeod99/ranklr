import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const FeedbackLegend: React.FC = () => {
  const legendItems = [
    { color: '#4caf50', label: 'Correct position' },
    { color: '#ff9800', label: 'Correct answer, wrong position' },
    { color: '#757575', label: 'Not in top 5' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 1, fontSize: '0.875rem' }}>
          Feedback Legend:
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {legendItems.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: item.color,
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="body2" fontSize="0.875rem">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FeedbackLegend;
