import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import http from '../http';
import { toast } from 'react-toastify';

function MyFeedbacks() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the user's feedbacks
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = () => {
        setLoading(true);
        http.get('/feedback/my-feedbacks')
            .then((res) => {
                setFeedbacks(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const deleteFeedback = (id) => {
        if (window.confirm("Are you sure you want to delete this feedback?")) {
            http.delete(`/feedback/${id}`)
                .then(() => {
                    toast.success("Feedback deleted successfully.");
                    // Refresh the feedback list after deletion
                    fetchFeedbacks();
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Failed to delete feedback.");
                });
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
                My Feedbacks
            </Typography>
            {feedbacks.length === 0 ? (
                <Typography>No feedbacks found</Typography>
            ) : (
                <List>
                    {feedbacks.map((feedback) => (
                        <ListItem key={feedback.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <ListItemText
                                primary={`Rating: ${feedback.rating}`}
                                secondary={`Feedback: ${feedback.feedbackContent || 'No feedback provided'}\nUpdated At: ${dayjs(feedback.updatedAt).format('YYYY-MM-DD HH:mm')}`}
                            />
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => deleteFeedback(feedback.id)}
                            >
                                Delete
                            </Button>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}

export default MyFeedbacks;
