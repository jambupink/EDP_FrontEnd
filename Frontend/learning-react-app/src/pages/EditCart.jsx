import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, CircularProgress, Paper } from "@mui/material";
import http from "../http";

const MAX_QUANTITY = 10;

const EditCart = () => {
    const { cartId } = useParams();  
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        http.get(`/cart/cartitem/${cartId}`)
            .then((res) => {
                setQuantity(res.data.quantity);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching cart item:", err);
                setError("Failed to load cart item.");
                setLoading(false);
            });
    }, [cartId]);

    const handleQuantityChange = (e) => {
        const newQuantity = Number(e.target.value);
        if (newQuantity > 0 && newQuantity <= MAX_QUANTITY) {
            setQuantity(newQuantity);
        }
    };

    const handleUpdateCart = async () => {
        if (quantity > MAX_QUANTITY) {
            setError(`You can only buy up to ${MAX_QUANTITY} items.`);
            return;
        }

        try {
            await http.put(`cart/${cartId}`, { quantity });
            navigate("/cart");
        } catch (error) {
            console.error("Error updating cart item:", error);
            setError("Failed to update cart item.");
        }
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <Paper elevation={3} sx={{ p: 4, width: "400px", textAlign: "center" }}>
                <Typography variant="h5" sx={{mb: 2}}gutterBottom>
                    Edit Item Quantity
                </Typography>
                
                {error && <Typography color="error">{error}</Typography>}

                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    fullWidth
                    inputProps={{ min: 1, max: MAX_QUANTITY }} // Enforces limits on input field
                    sx={{ mb: 2 }}
                />
                
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleUpdateCart}
                    sx={{ mb: 2 }}
                >
                    Update Cart
                </Button>

                <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth 
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>
            </Paper>
        </Box>
    );
};

export default EditCart;
