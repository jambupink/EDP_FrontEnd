import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../http';
import { toast } from 'react-toastify';

function EditFeedback() {
    const { id } = useParams(); // Get feedback ID from URL
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = () => {
        http.get(`/feedback/${id}`)
            .then((res) => {
                formik.setValues({
                    feedbackContent: res.data.feedbackContent || '',
                    rating: res.data.rating || '5'
                });
                setLoading(false);
            })
            .catch((err) => {
                toast.error('Error fetching feedback');
                setLoading(false);
            });
    };

    const formik = useFormik({
        initialValues: {
            feedbackContent: '',
            rating: '5',
        },
        validationSchema: yup.object({
            feedbackContent: yup.string().trim()
                .min(3, 'Feedback must be at least 3 characters')
                .max(500, 'Feedback must be at most 500 characters')
                .required('Feedback is required'),
            rating: yup.string().required('Rating is required'),
        }),
        onSubmit: (data) => {
            http.put(`/feedback/${id}`, data)
                .then(() => {
                    toast.success("Feedback updated successfully");
                    navigate('/my-feedbacks'); // Redirect back to feedback list
                })
                .catch((err) => {
                    toast.error("Failed to update feedback");
                });
        }
    });

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Feedback
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>

                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Rating (1-5)"
                    name="rating"
                    type="number"
                    inputProps={{ min: 1, max: 5 }}
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.rating && Boolean(formik.errors.rating)}
                    helperText={formik.touched.rating && formik.errors.rating}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="Feedback"
                    name="feedbackContent"
                    value={formik.values.feedbackContent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.feedbackContent && Boolean(formik.errors.feedbackContent)}
                    helperText={formik.touched.feedbackContent && formik.errors.feedbackContent}
                />
                
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Update
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default EditFeedback;
