import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid2 as Grid } from '@mui/material';
import { FormControl, InputLabel, FormHelperText, Select, MenuItem } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// npm install @mui/x-date-pickers
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Feedback } from '@mui/icons-material';

function FeedbackForm() {
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: 'My title',
            Feedback: '',
            price: 0,
            option: '5',
            date: dayjs().add(1, 'day'),
            time: dayjs().minute(0),
            datetime: dayjs().add(1, 'day').minute(0),
            tnc: true
        },
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            Feedback: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            price: yup.number().min(0).required('Price is required'),
            option: yup.string().required('Option is required'),
            date: yup.date().typeError('Invalid date').required('Date is required'),
            time: yup.date().typeError('Invalid time').required('Time is required'),
            datetime: yup.date().typeError('Invalid date time').required('Date Time is required'),
            tnc: yup.boolean().oneOf([true], 'Accept Terms & Conditions is required')
        }),
        onSubmit: (data) => {
            // Prepare the payload
            let dataToSubmit = {
                rating: data.option, // Ensure the selected rating value is mapped properly
                feedbackContent: data.Feedback.trim()
            };
        
            // Send the data to the backend
            http.post('/feedback', dataToSubmit)
                .then(() => {
                    toast.success('Feedback submitted successfully');
                    formik.resetForm(); // Reset the form if submission is successful
                })
                .catch((error) => {
                    toast.error('Failed to submit feedback');
                    console.error(error.response ? error.response.data : error.message);
                });
        }
        
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
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Feedback
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                <Grid size={{xs:12, md:6}}>
                            <FormControl fullWidth margin="dense"
                                error={formik.touched.option && Boolean(formik.errors.option)}>
                                <InputLabel>Rating</InputLabel>
                                <Select label="Rating"
                                    name="option"
                                    value={formik.values.option}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}  
                                >
                                    <MenuItem value={'5'}>5</MenuItem>
                                    <MenuItem value={'4'}>4</MenuItem>
                                    <MenuItem value={'3'}>3</MenuItem>
                                    <MenuItem value={'2'}>2</MenuItem>
                                    <MenuItem value={'1'}>1</MenuItem>
                                </Select>
                                <FormHelperText>{formik.touched.option && formik.errors.option}</FormHelperText>
                            </FormControl>
                        </Grid>
                    <Grid size={{xs:12, md:6, lg:8}} container spacing={2}>
                        {/* <Grid size={{xs:12}}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                label="Title"
                                name="title"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid> */}
                        <Grid size={{xs:12}}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                multiline minRows={2}
                                label="FeedbackContent"
                                name="Feedback"
                                value={formik.values.Feedback}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </Grid>
                        {/* <Grid size={{xs:12, md:6}}>
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                type="number"
                                inputProps={{
                                    min: 0,
                                    step: 0.1,
                                }}
                                label="Price"   
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.price && Boolean(formik.errors.price)}
                                helperText={formik.touched.price && formik.errors.price} />
                        </Grid> */}
                        
                        {/* <Grid size={{xs:12, md:6}}>
                            <FormControl fullWidth margin="dense">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker format="DD/MM/YYYY"
                                        label="Select Date"
                                        name="date"
                                        value={formik.values.date}
                                        onChange={(date) => formik.setFieldValue('date', date)}
                                        onBlur={() => formik.setFieldTouched('date', true)}
                                        slotProps={{
                                            textField: {
                                                error: formik.touched.date && Boolean(formik.errors.date),
                                                helperText: formik.touched.date && formik.errors.date
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid> */}
                        {/* <Grid size={{xs:12, md:6}}>
                            <FormControl fullWidth margin="dense">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Select Time"
                                        name="time"
                                        value={formik.values.time}
                                        onChange={(time) => formik.setFieldValue('time', time)}
                                        onBlur={() => formik.setFieldTouched('time', true)}
                                        slotProps={{
                                            textField: {
                                                error: formik.touched.time && Boolean(formik.errors.time),
                                                helperText: formik.touched.time && formik.errors.time
                                            }
                                        }} />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid> */}
                        {/* <Grid size={{xs:12}}>
                            <FormControl fullWidth margin="dense">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker format="DD/MM/YYYY hh:mm A"
                                        label="Select Date Time"
                                        name="datetime"
                                        value={formik.values.datetime}
                                        onChange={(datetime) => formik.setFieldValue('datetime', datetime)}
                                        onBlur={() => formik.setFieldTouched('datetime', true)}
                                        slotProps={{
                                            textField: {
                                                error: formik.touched.datetime && Boolean(formik.errors.datetime),
                                                helperText: formik.touched.datetime && formik.errors.datetime
                                            }
                                        }} />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid> */}
                    </Grid>

                    {/* <Grid size={{xs:12, md:6, lg:4}}>
                        <Box sx={{ textAlign: 'center', mt: 2 }} >
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file"
                                    onChange={onFileChange} />
                            </Button>
                            {
                                imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img alt="tutorial"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                        </img>
                                    </Box>
                                )
                            }
                        </Box>
                    </Grid> */}

                    {/* <Grid size={{xs:12}}>
                        <FormControl fullWidth margin="dense"
                            error={formik.touched.tnc && Boolean(formik.errors.tnc)}>
                            <FormControlLabel control={
                                <Checkbox name="tnc"
                                    checked={formik.values.tnc}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            } label="I Accept Terms & Conditions" />
                            <FormHelperText>{formik.touched.tnc && formik.errors.tnc}</FormHelperText>
                        </FormControl>
                    </Grid> */}
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default FeedbackForm;