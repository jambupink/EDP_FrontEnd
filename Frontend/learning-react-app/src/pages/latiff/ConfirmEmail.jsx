import React, { useEffect, useState } from 'react'
import http from '../../http';
import { Button } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ConfirmEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            verifyEmail();
            navigate("/login")
        }
    }, [token]);

    const verifyEmail = () => {
        http.get(`/user/confirm-email?token=${token}`)
            .then((res) => {
                console.log(res.data);
                setMessage("Email verified successfully!");

            })
            .catch((err) => {
                console.error(err);
                setMessage("Email verification failed.");
            });
    };
    return (
        <Button>
            submit
        </Button>
    )
}

export default ConfirmEmail