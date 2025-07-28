import React from 'react';
import { Box, Typography } from '@mui/material';

const Header: React.FC = () => {
  return (
    <Box textAlign="center" mb={4}>
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          fontSize: { xs: '2.5rem', md: '3rem' }
        }}
      >
        RANKLR
      </Typography>
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ fontSize: '1.1rem' }}
      >
        Daily Ranking Puzzle
      </Typography>
    </Box>
  );
};

export default Header;
