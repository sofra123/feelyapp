import React, { useState } from "react";
import axios from "./axios";

export function useAuthSubmit() {
    const [error, setError] = useState();
    const handleSubmit = () => {
        axios
            .post(url, values)
            .then(({ data }) => {
                if (!data.success) {
                    setError(true);
                } else {
                    location.replace("/");
                }
            })
            .catch(err => {
                console.log(err);
                setError(true);
            });
    };
    return [error, handleSubmit];
}
