import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, TextField, Button, Grid, Rating, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import http from "../http";

function AddReview() {
    const { id } = useParams(); // Get product ID
    const navigate = useNavigate();
    const location = useLocation();
    const productName = location.state?.productName || "Product"; // Default in case no name is passed

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [hasPurchased, setHasPurchased] = useState(null); // Stores if user has purchased this product
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPurchaseStatus = async () => {
            try {
                const res = await http.get(`/order/check-purchase/${id}`);
                setHasPurchased(res.data.hasPurchased);
            } catch (error) {
                console.error("Error checking purchase status:", error);
                setHasPurchased(false); // Assume they haven't purchased if there's an error
            }
            setLoading(false);
        };

        checkPurchaseStatus();
    }, [id]);

    const handleSubmit = async () => {
        if (!rating) {
            setDialogMessage("Please select a rating before submitting.");
            setErrorDialogOpen(true);
            return;
        }

        if (comment.trim().length < 5) {
            setDialogMessage("Your review must be at least 5 characters long.");
            setErrorDialogOpen(true);
            return;
        }

        try {
            await http.post("/review", {
                productId: id,
                rating: rating,
                comments: comment.trim(),
            });

            // Redirect to product details page
            navigate(`/productdetail/${id}`);
        } catch (error) {
            console.error("Failed to submit review:", error);
            setDialogMessage(error.response?.data || "Failed to submit review.");
            setErrorDialogOpen(true);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Add Review for {productName}
            </Typography>

            {loading ? (
                <Typography>Checking purchase history...</Typography>
            ) : !hasPurchased ? (
                <Typography color="error">
                    You can only review products you have purchased.
                </Typography>
            ) : (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Rating</Typography>
                            <Rating
                                name="rating"
                                value={rating}
                                precision={0.5}
                                onChange={(event, newValue) => setRating(newValue)}
                                size="large"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Write your review"
                                multiline
                                minRows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Button variant="outlined" color="secondary" onClick={() => navigate(`/productdetail/${id}`)}>
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={!hasPurchased} // Disable if user hasn't purchased
                            >
                                Submit Review
                            </Button>
                        </Grid>
                    </Grid>
                </>
            )}

            {/* Error Dialog */}
            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AddReview;