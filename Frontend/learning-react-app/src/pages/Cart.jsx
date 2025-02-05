import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Button, IconButton } from '@mui/material';
import { ShoppingCart, Delete, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const getCartItems = () => {
        http.get(`/cart/${user.id}`).then((res) => {
            console.log(res.data);
            setCartItems(res.data);
        });
    };

    const removeCartItem = (cartId) => {
        console.log("Removing item with cartId:", cartId); // Log the cartId to verify it's being passed correctly
    
        if (!cartId) {
            console.error('Cart ID is undefined');
            return;
        }
    
        http.delete(`/cart/${cartId}`, {
        
        })
        .then(() => {
            setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId)); 
        })
        .catch((error) => {
            console.error("There was an error deleting the item:", error);
        });
    };
    
    

    const handleCheckout = () => {
        navigate('/checkout', { state: { cartItems } });
    };

    useEffect(() => {
        if (user && user.id) {
            getCartItems();
        }
    }, [user]);

    

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Your Cart
            </Typography>
        
            <Grid container spacing={2}>
                {
                    cartItems.map((item) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={item.cartId}>
                                <Card>
                                    {
                                        item.image && (
                                            <Box className="aspect-ratio-container">
                                                <img alt="cart-item" src={`${import.meta.env.VITE_FILE_BASE_URL}${item.image}`} />
                                            </Box>
                                        )
                                    }
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {item.productName}
                                            </Typography>
                                        </Box>
    
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <Typography>
                                                {item.size}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <Typography>
                                                Qty:
                                                {item.quantity}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography>
                                                Price: ${item.price}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Link to={`/editcart/${item.cartId}`}>
                                                <IconButton color="primary">
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                            <IconButton color="error" onClick={() => {
                                                console.log('Deleting item with ID:', item.id); // Add this log
                                                removeCartItem(item.cartId);
                                            }}>
                                                <Delete />
                                            </IconButton>

                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleCheckout}>
                    Proceed to Checkout
                </Button>
            </Box>
        </Box>
    );
}

export default Cart;
