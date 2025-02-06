// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Typography, TextField, Button, Grid2 as Grid, FormControl, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import http from '../http';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function AddProduct() {
//     const navigate = useNavigate();
//     const [imageFile, setImageFile] = useState(null);

//     const formik = useFormik({
//         initialValues: {
//             productName: "",
//             description: "",
//             isArchived: false
//         },
//         validationSchema: yup.object({
//             productName: yup.string().trim()
//                 .min(3, 'Product name must be at least 3 characters')
//                 .max(100, 'Product name must be at most 100 characters')
//                 .required('Product name is required'),
//             description: yup.string().trim()
//                 .min(3, 'Description must be at least 3 characters')
//                 .max(300, 'Description must be at most 300 characters')
//                 .required('Description is required'),
//             isArchived: yup.boolean()
//         }),
//         onSubmit: (data) => {
//             if (imageFile) {
//                 data.imageFile = imageFile;
//             }
//             data.productName = data.productName.trim();
//             data.description = data.description.trim();
//             http.post("/product", data)
//                 .then((res) => {
//                     console.log(res.data);
//                     navigate("/products");
//                 });
//         }
//     });

//     const onFileChange = (e) => {
//         let file = e.target.files[0];
//         if (file) {
//             if (file.size > 1024 * 1024) {
//                 toast.error('Maximum file size is 1MB');
//                 return;
//             }
//             let formData = new FormData();
//             formData.append('file', file);
//             http.post('/file/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             })
//                 .then((res) => {
//                     setImageFile(res.data.filename);
//                 })
//                 .catch(function (error) {
//                     console.log(error.response);
//                 });
//         }
//     };

//     return (
//         <Box>
//             <Typography variant="h5" sx={{ my: 2 }}>
//                 Add Product
//             </Typography>
//             <Box component="form" onSubmit={formik.handleSubmit}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} md={6} lg={8}>
//                         <TextField
//                             fullWidth
//                             margin="dense"
//                             autoComplete="off"
//                             label="Product Name"
//                             name="productName"
//                             value={formik.values.productName}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             error={formik.touched.productName && Boolean(formik.errors.productName)}
//                             helperText={formik.touched.productName && formik.errors.productName}
//                         />
//                         <TextField
//                             fullWidth
//                             margin="dense"
//                             autoComplete="off"
//                             multiline
//                             minRows={2}
//                             label="Description"
//                             name="description"
//                             value={formik.values.description}
//                             onChange={formik.handleChange}
//                             onBlur={formik.handleBlur}
//                             error={formik.touched.description && Boolean(formik.errors.description)}
//                             helperText={formik.touched.description && formik.errors.description}
//                         />
//                         <FormControl fullWidth margin="dense"
//                             error={formik.touched.isArchived && Boolean(formik.errors.isArchived)}>
//                             <FormControlLabel control={
//                                 <Checkbox name="isArchived"
//                                     checked={formik.values.isArchived}
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur} />
//                             } label="Product is currently out of stock" />
//                             <FormHelperText>{formik.touched.isArchived && formik.errors.isArchived}</FormHelperText>
//                         </FormControl>
//                     </Grid>
//                     <Grid size={{xs:12, md:6, lg:4}}>
//                         <Box sx={{ textAlign: 'center', mt: 2 }} >
//                             <Button variant="contained" component="label">
//                                 Upload Image
//                                 <input hidden accept="image/*" multiple type="file"
//                                     onChange={onFileChange} />
//                             </Button>
//                             {
//                                 imageFile && (
//                                     <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
//                                         <img alt="tutorial"
//                                             src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
//                                         </img>
//                                     </Box>
//                                 )
//                             }
//                         </Box>
//                     </Grid>
//                 </Grid>
//                 <Box sx={{ mt: 2 }}>
//                     <Button variant="contained" type="submit">
//                         Add Product
//                     </Button>
//                 </Box>
//             </Box>
//             <ToastContainer />
//         </Box>
//     );
// }

// export default AddProduct;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, FormControl, FormControlLabel, Checkbox, FormHelperText, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddProduct() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const formik = useFormik({
        initialValues: {
            productName: "",
            description: "",
            isArchived: false
        },
        validationSchema: yup.object({
            productName: yup.string().trim()
                .min(3, 'Product name must be at least 3 characters')
                .max(100, 'Product name must be at most 100 characters')
                .required('Product name is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(300, 'Description must be at most 300 characters')
                .required('Description is required'),
            isArchived: yup.boolean()
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.productName = data.productName.trim();
            data.description = data.description.trim();
            http.post("/product", data)
                .then((res) => {
                    toast.success("Product added successfully!");
                    navigate("/products");
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Failed to add product. Please try again.");
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
                    toast.success("Image uploaded successfully!");
                })
                .catch((error) => {
                    console.error(error.response);
                    toast.error("Image upload failed. Please try again.");
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Product
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Product Name"
                            name="productName"
                            value={formik.values.productName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.productName && Boolean(formik.errors.productName)}
                            helperText={formik.touched.productName && formik.errors.productName}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                        <FormControl fullWidth margin="dense" error={formik.touched.isArchived && Boolean(formik.errors.isArchived)}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isArchived"
                                        checked={formik.values.isArchived}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                }
                                label="Product is currently out of stock"
                            />
                            <FormHelperText>{formik.touched.isArchived && formik.errors.isArchived}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </Button>
                            {imageFile && (
                                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                    <img
                                        alt="Uploaded"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                        style={{ maxWidth: "100%", height: "auto" }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add Product
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddProduct;