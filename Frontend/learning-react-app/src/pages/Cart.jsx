import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Divider,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const getCartItems = () => {
        if (user?.id) {
            http.get(`/cart/${user.id}`)
                .then((res) => {
                    setCartItems(res.data);
                })
                .catch((error) => console.error('Error fetching cart items:', error));
        }
    };

    const removeCartItem = (cartId) => {
        if (!cartId) {
            console.error('Cart ID is undefined');
            return;
        }

        http.delete(`/cart/${cartId}`)
            .then(() => {
                setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
            })
            .catch((error) => console.error('Error deleting cart item:', error));
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { cartItems } });
    };

    useEffect(() => {
        getCartItems();
    }, [user]);

    useEffect(() => {
        console.log("Cart Items:", cartItems); // Debugging line
    }, [cartItems]);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {cartItems.length === 0 ? (
                <Typography variant="h6" color="text.secondary">
                    Your cart is empty.
                </Typography>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Size</TableCell>
                                    <TableCell>Colour</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.cartId}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <img
                                                src={`${import.meta.env.VITE_FILE_BASE_URL}${item.imageFile}`} // Ensure this is the correct field from your API
                                                alt={item.productName}
                                                style={{ width: 50, height: 50, paddingRight: 15, objectFit: 'cover', borderRadius: 4 }}
                                                />
                                                <Typography>{item.productName}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{item.size}</TableCell>
                                        <TableCell>{item.color}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>${item.price}</TableCell>
                                        <TableCell>
                                            <Box display="flex" gap={1}>
                                                <Link to={`/editcart/${item.cartId}`}>
                                                    <IconButton color="primary">
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeCartItem(item.cartId)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 3,
                        }}
                    >
                        <Typography variant="h6">
                            Total: $
                            {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default Cart;
