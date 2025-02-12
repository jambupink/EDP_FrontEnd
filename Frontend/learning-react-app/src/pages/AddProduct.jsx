import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, FormControl, FormControlLabel, Checkbox, FormHelperText, Grid, InputLabel, Select, MenuItem, List, ListItem, ListItemText, Card, CardContent, IconButton } from '@mui/material';
import { useFormik, FieldArray } from 'formik';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddProduct() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const categoryOptions = ["Tops", "Bottoms"];
    const genderOptions = ["Men's", "Women's", "Both"];
    const [variant, setVariant] = useState({ color: "", size: "", price: "", stock: "" });
    const [variants, setVariants] = useState([]); // Stores all added variants
    const [editingIndex, setEditingIndex] = useState(null);

    const formik = useFormik({
        initialValues: {
            productName: "",
            description: "",
            categoryName: "",
            categoryGender: "",
            isArchived: false,
            variants: []
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
            categoryName: yup.string().required("Category is required"),
            categoryGender: yup.string().required("Gender is required"),
            isArchived: yup.boolean(),
            variants: yup.array().of(
                yup.object().shape({
                    color: yup.string().required("Color is required"),
                    size: yup.string().required("Size is required"),
                    price: yup.number().min(0, "Price must be positive").required("Price is required"),
                    stock: yup.number().min(0, "Stock must be positive").required("Stock is required")
                })
            )
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.productName = data.productName.trim();
            data.description = data.description.trim();
            data.variants = [...variants].map(v => ({
                color: v.color.trim(),
                size: v.size.trim(),
                price: Number(v.price).toFixed(2),
                stock: Number(v.stock)
            }));
            console.log("Submitting product with variants:", data); 
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

    const addOrUpdateVariant = () => {
        if (!variant.color || !variant.size || !variant.price || !variant.stock) {
            toast.error("Please fill all variant fields before adding.");
            return;
        }
    
        const formattedVariant = {
            color: variant.color.trim(),
            size: variant.size.trim(),
            price: Number(variant.price).toFixed(2),
            stock: Number(variant.stock)
        };
    
        if (editingIndex !== null) {
            // Update variant in the list
            const updatedVariants = [...variants];
            updatedVariants[editingIndex] = formattedVariant;
            setVariants(updatedVariants);
            setEditingIndex(null);
        } else {
            // Add new variant
            setVariants([...variants, formattedVariant]);
        }
    
        setVariant({ color: "", size: "", price: "", stock: "" }); // Reset fields
    
        console.log("Variants List After Addition:", variants); // Debugging
    };    

    const editVariant = (index) => {
        setVariant(variants[index]);
        setEditingIndex(index);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
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

                        {/* Category Dropdown */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="categoryName"
                                value={formik.values.categoryName}
                                onChange={formik.handleChange}
                                label="Category"
                            >
                                {categoryOptions.map((category, index) => (
                                    <MenuItem key={index} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Gender Dropdown */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="categoryGender"
                                value={formik.values.categoryGender}
                                onChange={formik.handleChange}
                                label="Gender"
                            >
                                {genderOptions.map((gender, index) => (
                                    <MenuItem key={index} value={gender}>{gender}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Variant Fields */}
                        <Typography variant="h6" sx={{ mt: 2 }}>Variants</Typography>
                        <Grid container spacing={1}>
                            {["Color", "Size", "Price", "Stock"].map((field, index) => (
                                <Grid item xs={3} key={index}>
                                    <TextField
                                        label={field}
                                        name={field.toLowerCase()}
                                        type={field === "Price" || field === "Stock" ? "number" : "text"}
                                        value={variant[field.toLowerCase()]}
                                        onChange={(e) => setVariant({ ...variant, [field.toLowerCase()]: e.target.value })}
                                        fullWidth
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Button variant="contained" sx={{ mt: 1 }} onClick={addOrUpdateVariant}>
                            {editingIndex !== null ? <DoneIcon /> : "Add to Product"}
                        </Button>

                        {variants.map((v, index) => (
                            <Card key={index} sx={{ my: 1, p: 2, background: "#f5f5f5", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body1">
                                        <strong>Color:</strong> {v.color}, <strong>Size:</strong> {v.size}, <strong>Price:</strong> ${v.price}, <strong>Stock:</strong> {v.stock}
                                    </Typography>
                                </CardContent>
                                <Box>
                                    <IconButton onClick={() => editVariant(index)} sx={{ color: 'gray' }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => removeVariant(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        ))}

                        <FormControl fullWidth margin="dense">
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
                                        style={{ maxWidth: "50%", height: "auto" }}
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