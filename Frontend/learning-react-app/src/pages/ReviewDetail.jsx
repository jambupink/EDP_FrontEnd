import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Button, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import http from "../http";

function ReviewDetail() {
    const { id } = useParams(); // Product ID
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await http.get(`/review/product/${id}`);
                setReviews(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
                setLoading(false);
            }
        };
        fetchReviews();
    }, [id]);

    const handleDeleteClick = (reviewId) => {
        setSelectedReviewId(reviewId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedReviewId) return;

        try {
            await http.delete(`/review/${selectedReviewId}`);
            setReviews(reviews.filter(review => review.reviewId !== selectedReviewId));
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
        
        setDeleteDialogOpen(false);
        setSelectedReviewId(null);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Reviews
            </Typography>

            {/* Back to Product Button */}
            <Button variant="outlined" onClick={() => navigate(`/productdetail/${id}`)} sx={{ mb: 2 }}>
                Back to Product
            </Button>

            {/* Loading State */}
            {loading ? (
                <Typography>Loading reviews...</Typography>
            ) : reviews.length === 0 ? (
                <Typography>No reviews yet.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {reviews.map((review) => (
                        <Grid item xs={12} key={review.reviewId}>
                            <Card sx={{ boxShadow: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {review.userName} - {new Date(review.reviewDate).toLocaleDateString()}
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                        {Array.from({ length: Math.round(review.rating) }).map((_, index) => (
                                            <StarIcon key={index} sx={{ color: "gold", fontSize: 20 }} />
                                        ))}
                                        <Typography sx={{ ml: 1 }}>{review.rating} / 5</Typography>
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        {review.comments}
                                    </Typography>

                                    {/* Edit and Delete Buttons */}
                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                                        <IconButton color="primary" onClick={() => navigate(`/edit-review/${review.reviewId}`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteClick(review.reviewId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Review</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this review? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ReviewDetail;