import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';

const EditCart = () => {
    const { cartId } = useParams();  // Assuming the cart ID is passed in the URL
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        http.get(`/cart/cartitem/${cartId}`).then((res) => {
            setQuantity(res.data.quantity);  // Set the quantity from the response
            setLoading(false);  // Set loading to false once data is fetched
        }).catch((err) => {
            console.error('Error fetching cart item:', err);
            setLoading(false);  // Stop loading even if there's an error
        });
    }, [cartId])

    const handleUpdateCart = async () => {
        try {
            const updateData = { quantity };
            await http.put(`cart/${cartId}`, updateData);
            navigate('/cart');  // Redirect after updating the cart item
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Edit Cart Item</h2>
            <div>
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
            </div>
            <button onClick={handleUpdateCart}>Update Cart</button>
        </div>
    );
};

export default EditCart;
