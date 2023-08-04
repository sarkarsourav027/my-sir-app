import React from 'react';
import {toast} from "react-toastify";

function Success(response) {
    return (
        toast.error(response.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        }));
}

export default Success;