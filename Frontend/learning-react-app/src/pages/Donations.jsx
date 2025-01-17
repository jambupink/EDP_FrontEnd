import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Grid } from '@mui/material';
import { FormControl, InputLabel, FormHelperText, Select, MenuItem } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

function Donations() {
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: 'My title',
            description: 'My description',
            price: 0,
            option: 'A',
            date: dayjs().add(1, 'day'),
            time: dayjs().minute(0),
            condition: '',
            tnc: true,
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            price: yup.number().min(0).required('Price is required'),
            option: yup.string().required('Option is required'),
            date: yup.date().typeError('Invalid date').required('Date is required'),
            time: yup.date().typeError('Invalid time').required('Time is required'),
            condition: yup.string().required('Condition is required'),
            tnc: yup.boolean().oneOf([true], 'Accept Terms & Conditions is required'),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            let dataToSubmit = { ...data };
            dataToSubmit.title = data.title.trim();
            dataToSubmit.description = data.description.trim();
            dataToSubmit.date = data.date.format('YYYY-MM-DD');
            dataToSubmit.time = data.time.format('HH:mm');
            console.log(dataToSubmit);
            toast.success('Form submitted successfully');
        },
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    const onDeleteImage = () => {
        setImageFile(null);
        toast.info('Image deleted successfully');
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Donations Form
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Please fill in the details and pick a date and time to drop off your clothing! 
                We will get back to you after evaluating your request.
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Title"
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
                            label="Description of the clothing"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    label="Select Date for dropoff"
                                    name="date"
                                    value={formik.values.date}
                                    onChange={(date) => formik.setFieldValue('date', date)}
                                    onBlur={() => formik.setFieldTouched('date', true)}
                                    slotProps={{
                                        textField: {
                                            error: formik.touched.date && Boolean(formik.errors.date),
                                            helperText: formik.touched.date && formik.errors.date,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="dense">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                    label="Select Time for dropoff"
                                    name="time"
                                    value={formik.values.time}
                                    onChange={(time) => formik.setFieldValue('time', time)}
                                    onBlur={() => formik.setFieldTouched('time', true)}
                                    slotProps={{
                                        textField: {
                                            error: formik.touched.time && Boolean(formik.errors.time),
                                            helperText: formik.touched.time && formik.errors.time,
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 2 }}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </Button>
                            {imageFile && (
                                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <img
                                        alt="uploaded"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                        style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '8px' }}
                                    />
                                    <Button variant="outlined" color="error" onClick={onDeleteImage}>
                                        Delete Image
                                    </Button>
                                </Box>
                            )}
                            <Button variant="contained" type="submit" sx={{ mt: 3 }}>
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default Donations;
