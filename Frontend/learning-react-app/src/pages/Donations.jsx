import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { FormControl } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function Donation() {
    const location = useLocation();
    const navigate = useNavigate();
    const existingDonation = location.state?.donationDetails; // Get donation details from navigation state
    const [imageFile, setImageFile] = useState(existingDonation?.imageFile || null);
    const isEditing = !!existingDonation; // Determine if we are in edit mode

    const formik = useFormik({
        initialValues: {
            title: existingDonation?.title || 'Donation Title',
            description: existingDonation?.description || 'Description',
            donationDateTime: existingDonation?.donationDateTime
                ? dayjs(existingDonation.donationDateTime)
                : dayjs().add(1, 'day').minute(0),
            condition: existingDonation?.condition || 'brand new',
        },
        validationSchema: yup.object({
            donationDateTime: yup.date().typeError('Invalid date time').required('Date Time is required'),
        }),
        onSubmit: (data) => {
            const updatedData = {
                title: data.title,
                description: data.description,
                condition: data.condition,
                donationDateTime: data.donationDateTime.format('YYYY-MM-DD HH:mm:ss'),
                imageFile: imageFile || null, // Include image if available
            };

            const endpoint = isEditing ? `/donation/${existingDonation.id}/datetime` : '/donate';
            const method = isEditing ? http.put : http.post;

            method(endpoint, updatedData)
                .then(() => {
                    toast.success(
                        isEditing
                            ? 'Donation updated successfully!'
                            : 'Donation form submitted successfully!'
                    );
                    navigate('/donationsubmission'); // Redirect to review page
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Failed to update donation.');
                });
        },
    });

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            http.post('/file/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then((res) => {
                    setImageFile(res.data.filename); // Update state with uploaded filename
                    toast.success('Image uploaded successfully.');
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Failed to upload image.');
                });
        }
    };

    const deleteImage = () => {
        if (imageFile) {
            http.delete(`/file/${imageFile}`)
                .then(() => {
                    setImageFile(null); // Clear the imageFile state
                    toast.success('Image deleted successfully.');
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Failed to delete image.');
                });
        } else {
            toast.error('No image to delete.');
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                {isEditing ? 'Edit Pickup Date & Time' : 'Donation Form'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                {isEditing
                    ? 'Update the pickup date and time for your donation.'
                    : 'Please enter all the details below and choose a date and time to drop off your clothing.'}
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    {!isEditing && (
                        <>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Donation Title"
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    multiline
                                    minRows={2}
                                    label="About Donation"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="dense">
                                    <TextField
                                        fullWidth
                                        select
                                        label="Condition"
                                        name="condition"
                                        value={formik.values.condition}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value="brand new">Brand New</option>
                                        <option value="like new">Like New</option>
                                        <option value="lightly used">Lightly Used</option>
                                        <option value="well used">Well Used</option>
                                        <option value="heavily used">Heavily Used</option>
                                    </TextField>
                                </FormControl>
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    format="DD/MM/YYYY hh:mm A"
                                    label="Select Pickup Date and Time"
                                    name="donationDateTime"
                                    value={formik.values.donationDateTime}
                                    onChange={(datetime) => formik.setFieldValue('donationDateTime', datetime)}
                                    onBlur={() => formik.setFieldTouched('donationDateTime', true)}
                                    slotProps={{
                                        textField: {
                                            error: formik.touched.donationDateTime && Boolean(formik.errors.donationDateTime),
                                            helperText: formik.touched.donationDateTime && formik.errors.donationDateTime,
                                            fullWidth: true,
                                            margin: 'dense',
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </Button>
                            {imageFile && (
                                <Box sx={{ mt: 2 }}>
                                    <img
                                        alt="donation"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                                        <Button variant="outlined" color="error" onClick={deleteImage}>
                                            Delete Image
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                width: '200px',
                                margin: '0 auto',
                                display: 'block',
                                mt: 2,
                                mb: 4,
                            }}
                        >
                            {isEditing ? 'Update' : 'Submit'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default Donation;


