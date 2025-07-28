import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
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
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {gameWon ? '🎉 Congratulations!' : '😅 Game Over'}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {gameWon 
            ? `You solved it in ${attemptsUsed}/${maxAttempts} attempts!`
            : `Better luck next time! (${attemptsUsed}/${maxAttempts} attempts)`
          }
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Correct Answer:
        </Typography>
        <List dense>
          {correctAnswers.map((answer, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText
                primary={`${index + 1}. ${answer}`}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 'medium',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
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
