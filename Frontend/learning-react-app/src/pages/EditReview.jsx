import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Rating } from "@mui/material";
import http from "../http";

function EditReview() {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await http.get(`/review/${reviewId}`);
                setRating(res.data.rating);
                setComment(res.data.comments);
            } catch (error) {
                console.error("Failed to fetch review:", error);
            }
        };
        fetchReview();
    }, [reviewId]);

    const handleSubmit = async () => {
        if (!rating) {
            alert("Please select a rating");
            return;
        }

        try {
            await http.put(`/review/${reviewId}`, {
                rating: rating,
                comments: comment,
            });
            navigate(-1); // Go back to the previous page
        } catch (error) {
            console.error("Failed to update review:", error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Edit Review
            </Typography>

            <Typography variant="h6">Rating</Typography>
            <Rating
                name="rating"
                value={rating}
                precision={0.5}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
            />

            <TextField
                fullWidth
                label="Write your review"
                multiline
                minRows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mt: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Update Review
                </Button>
            </Box>
        </Box>
    );
}

export default EditReview;