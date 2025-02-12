import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Button, Card, CardMedia, Select, MenuItem } from '@mui/material';
import http from '../http';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [stock, setStock] = useState(null);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await http.get(`/product/product/${id}`);
                setProduct(res.data);
                setLoading(false);

                // Extract unique colors and sizes
                const colors = [...new Set(res.data.variants.map(v => v.color))];
                const sizes = [...new Set(res.data.variants.map(v => v.size))];

                setAvailableColors(colors);
                setAvailableSizes(sizes);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    // Handle color selection
    const handleColorChange = (color) => {
        setSelectedColor(color);
        const sizesForColor = product.variants
            .filter(v => v.color === color)
            .map(v => v.size);
        setAvailableSizes(sizesForColor);
        setSelectedSize('');
        setStock(null);
    };

    // Handle size selection
    const handleSizeChange = (size) => {
        setSelectedSize(size);
        const selectedVariant = product.variants.find(v => v.color === selectedColor && v.size === size);
        setStock(selectedVariant ? selectedVariant.stock : null);
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
                {/* Image Section */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ boxShadow: 3, height: 550, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CardMedia
                            component="img"
                            image={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                            alt={product.productName}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Card>
                </Grid>

                {/* Product Details */}
                <Grid item xs={12} md={6}>
                    {/* Product Name & Price */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mr: 2 }}>
                            {product.productName}
                        </Typography>
                        {product.variants.length > 0 && (
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'green' }}>
                                ${product.variants[0].price}
                            </Typography>
                        )}
                    </Box>

                    {/* Gender & Category */}
                    <Typography variant="body1" sx={{ color: 'gray', mb: 2 }}>
                        {product.categoryGender} {product.categoryName}
                    </Typography>

                    {/* Product Description */}
                    <Typography variant="body1">{product.description}</Typography>

                    {/* Color Selection */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Color</Typography>
                        <Select
                            fullWidth
                            value={selectedColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                        >
                            <MenuItem value="" disabled>Select a color</MenuItem>
                            {availableColors.map((color, index) => (
                                <MenuItem key={index} value={color}>{color}</MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Size Selection */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Size</Typography>
                        <Select
                            fullWidth
                            value={selectedSize}
                            onChange={(e) => handleSizeChange(e.target.value)}
                            disabled={!selectedColor}
                        >
                            <MenuItem value="" disabled>Select a size</MenuItem>
                            {availableSizes.map((size, index) => (
                                <MenuItem key={index} value={size}>{size}</MenuItem>
                            ))}
                        </Select>
                    </Box>

                    {/* Stock Display */}
                    {selectedSize && (
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Stock: {stock !== null ? stock : 'N/A'}
                        </Typography>
                    )}

                    {/* Add to Cart Button */}
                    <Button 
                        variant="contained" 
                        color="success" 
                        sx={{ mt: 3, fontSize: '16px', fontWeight: 'bold', p: 1.5 }}
                        disabled={!selectedSize || !selectedColor}
                    >
                        ADD TO CART
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ProductDetail;