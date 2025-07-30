import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

interface ResultsDialogProps {
  open: boolean;
  gameWon: boolean;
  attemptsUsed: number;
  maxAttempts: number;
  correctAnswers: readonly string[];
  onClose: () => void;
  onShare: () => void;
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({
  open,
  gameWon,
  attemptsUsed,
  maxAttempts,
  correctAnswers,
  onClose,
  onShare
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 2, pt: 3 }}>
        <Typography variant="h4" component="div" sx={{ mb: 0.5 }}>
          {gameWon ? '🎉 Congratulations!' : '😬 Game Over'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {gameWon 
            ? `You solved it in ${attemptsUsed}/${maxAttempts} attempts!`
            : `Better luck next time! (Used all ${maxAttempts} attempts)`
          }
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, pb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Correct Answer:
        </Typography>
        <Box sx={{ 
          backgroundColor: 'action.hover', 
          borderRadius: 1, 
          p: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          {correctAnswers.map((answer, index) => (
            <Typography 
              key={index} 
              variant="body1" 
              sx={{ 
                fontWeight: 500,
                mb: index < correctAnswers.length - 1 ? 0.5 : 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  minWidth: '24px',
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                {index + 1}.
              </Box>
              {answer}
            </Typography>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={onShare}
          sx={{ minWidth: 120 }}
        >
          Share Results
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultsDialog;
