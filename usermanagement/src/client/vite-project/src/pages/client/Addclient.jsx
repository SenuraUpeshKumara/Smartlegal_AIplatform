import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Addclient = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientAge: '',
    clientGender: '',
    plaintiffName: '',
    evidence: '',
  });

  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Client Data:', formData);

    // Simulating API Call
    setTimeout(() => {
      setOpenSuccessDialog(true);
      setFormData({
        clientName: '',
        clientAge: '',
        clientGender: '',
        plaintiffName: '',
        evidence: '',
      });
    }, 500);
  };

  const handleClose = () => {
    setOpenSuccessDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Paper sx={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Add Client
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Client's Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            label="Client's Age"
            name="clientAge"
            type="number"
            value={formData.clientAge}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            label="Client's Gender"
            name="clientGender"
            value={formData.clientGender}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            label="Plaintiff's Name"
            name="plaintiffName"
            value={formData.plaintiffName}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ marginBottom: '15px' }}
          />
          <TextField
            fullWidth
            label="Evidence"
            name="evidence"
            value={formData.evidence}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            sx={{ marginBottom: '15px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#3f51b5',
                '&:hover': { backgroundColor: '#283593' },
                padding: '10px 20px',
              }}
            >
              Add Client
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                backgroundColor: '#e74c3c',
                '&:hover': { backgroundColor: '#c0392b' },
                padding: '10px 20px',
              }}
              onClick={() => navigate('/clienthome')}
            >
              Back to Dashboard
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Success Popup Dialog */}
      <Dialog 
        open={openSuccessDialog} 
        onClose={handleClose} 
        disableEnforceFocus 
        disableRestoreFocus
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Alert severity="success">Client successfully submitted!</Alert>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="primary" 
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Addclient;
