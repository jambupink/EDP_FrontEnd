import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import http from '../http'; // Assuming this is your HTTP client setup
import { useNavigate } from 'react-router-dom';



function ReviewRequest() {
    const [donationDetails, setDonationDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newDateTime, setNewDateTime] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the most recent donation submission
        http.get('/donation/latest') // Replace with the correct endpoint
            .then((res) => {
                setDonationDetails(res.data);
                setNewDateTime(dayjs(res.data.donationDateTime)); // Set initial date for editing
            })
            .catch((error) => {
                console.error('Error fetching the latest donation:', error);
            });
    }, []);

    const handleUpdate = () => {
        if (!newDateTime) {
            alert("Please select a valid date and time.");
            return;
        }

        // Send update request to the server
        http.put(`/donation/${donationDetails.id}`, { donationDateTime: newDateTime.format('YYYY-MM-DD HH:mm:ss') })
            .then(() => {
                setDonationDetails((prev) => ({ ...prev, donationDateTime: newDateTime.format('YYYY-MM-DD HH:mm:ss') }));
                setIsEditing(false); // Exit editing mode
                alert("Date & Time updated successfully.");
            })
            .catch((error) => {
                console.error('Error updating the donation:', error);
                alert("Failed to update Date & Time.");
            });
    };

    if (!donationDetails) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6">Loading your donation details...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
                Review My Request
            </Typography>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Title: {donationDetails.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Description: {donationDetails.description}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Condition: {donationDetails.condition}
                    </Typography>
                    {!isEditing ? (
                        <>
                            <Typography variant="body1" gutterBottom>
                                Date & Time: {donationDetails.donationDateTime}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                onClick={() =>
                                    navigate(`/donations`, {
                                        state: { donationDetails },
                                    })
                                }
                            >
                                Edit Date & Time
                            </Button>
                        </>
                    ) : (
                        <>
                            <LocalizationProvider dateAdapter={dayjs}>
                                <DateTimePicker
                                    label="Edit Date & Time"
                                    value={newDateTime}
                                    onChange={(datetime) => setNewDateTime(datetime)}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth margin="dense" />
                                    )}
                                />
                            </LocalizationProvider>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleUpdate}>
                                    Save
                                </Button>
                            </Box>
                        </>
                    )}
                    {donationDetails.imageFile && (
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <img
                                alt="donation"
                                src={`${import.meta.env.VITE_FILE_BASE_URL}${donationDetails.imageFile}`}
                                style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default ReviewRequest;

