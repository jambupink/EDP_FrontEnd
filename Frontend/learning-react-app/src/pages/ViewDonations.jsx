import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Divider } from '@mui/material';
import dayjs from 'dayjs';
import http from '../http'; // Ensure this is your configured Axios instance or fetch wrapper
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function ViewDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user donations
    http.get('/Donation/user-donations') // Adjust the endpoint if needed
      .then((res) => {
        setDonations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch donations:', err);
        setError('Failed to fetch donations. Please try again later.');
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        Your Donations
      </Typography>

      {/* Display Loading State */}
      {loading && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Display Error Message */}
      {error && (
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Display Donations */}
      {!loading && !error && donations.length > 0 && (
        <Grid container spacing={3}>
          {donations.map((donation) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={donation.id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 3,
                  '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
                  transition: '0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {donation.title}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {donation.description}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 18, mr: 1, color: 'success.main' }} />
                  Condition: {donation.condition}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                  Date: {dayjs(donation.donationDateTime).format('DD/MM/YYYY hh:mm A')}
                </Typography>
                {donation.imageFile && (
                  <Box
                    sx={{
                      mt: 2,
                      textAlign: 'center',
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid #ddd',
                    }}
                  >
                    <img
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${donation.imageFile}`}
                      alt={donation.title}
                      style={{
                        width: '100%',
                        maxHeight: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Display No Donations Message */}
      {!loading && !error && donations.length === 0 && (
        <Typography sx={{ my: 4, textAlign: 'center', color: 'text.secondary' }}>
          No donations found. Start donating today!
        </Typography>
      )}
    </Box>
  );
}

export default ViewDonations;



