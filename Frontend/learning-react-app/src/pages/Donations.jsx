import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { FormControl, FormHelperText } from '@mui/material';
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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function Donation() {
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            title: 'Donation Title',
            description: 'Description',
            donationDateTime: dayjs().add(1, 'day').minute(0),
            tnc: true,
            condition: 'brand new',
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
            donationDateTime: yup.date().typeError('Invalid date time').required('Date Time is required'),
            tnc: yup.boolean().oneOf([true], 'Accept Terms & Conditions is required'),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            let dataToSubmit = { ...data };
            dataToSubmit.title = data.title.trim();
            dataToSubmit.description = data.description.trim();
            dataToSubmit.donationDateTime = data.donationDateTime.format('YYYY-MM-DD HH:mm:ss');
            dataToSubmit.condition = data.condition.trim();
            console.log(dataToSubmit);

            http.post("/donate", dataToSubmit)
                .then((res) => {
                    console.log(res.data);
                    toast.success(`Donation form submitted successfully. Reference = ${res.data.id}`);
                    window.location.href = "/donation-submission"; //link to DonationSubmission
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

    const deleteImage = () => {
        if (imageFile) {
            http.delete(`/file/${imageFile}`)
                .then(() => {
                    setImageFile(null);
                    toast.success('Image deleted successfully');
                })
                .catch((error) => {
                    console.error(error.response || error.message);
                    toast.error('Failed to delete image');
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Donation Form
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
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
                        <FormControl fullWidth margin="dense" error={formik.touched.condition && Boolean(formik.errors.condition)}>
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
                                error={formik.touched.condition && Boolean(formik.errors.condition)}
                                helperText={formik.touched.condition && formik.errors.condition}
                            >
                                <option value="brand new">Brand New</option>
                                <option value="like new">Like New</option>
                                <option value="lightly used">Lightly Used</option>
                                <option value="well used">Well Used</option>
                                <option value="heavily used">Heavily Used</option>
                            </TextField>
                        </FormControl>
                    </Grid>
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
                                            margin: "dense"
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
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={deleteImage}
                                        >
                                            Delete Image
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="dense" error={formik.touched.tnc && Boolean(formik.errors.tnc)}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="tnc"
                                        checked={formik.values.tnc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                }
                                label="I Accept Terms & Conditions"
                            />
                            <FormHelperText>{formik.touched.tnc && formik.errors.tnc}</FormHelperText>
                        </FormControl>
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
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default Donation;
