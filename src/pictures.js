import axios from "./axios";
import React, { useState, useEffect } from "react";

export default function Pictures(props) {
    // let images = Array.from(props.pic);
    // console.log("images", images);

    const [images, setImages] = useState([]);
    console.log("images", images);

    useEffect(() => {
        // console.log(props.pic || "in useEffect");
        axios
            .get("/getimages")
            .then(({ data }) => {
                console.log("getpictures GET /users results: ", data);
                setImages(data.rows);
            })
            .catch(err => {
                console.log("getpictures GET /users catch err: ", err);
            });
    }, [props]);

    return (
        <div className="background-users">
            <div className="containerfav">
                <h1 className="fav">My favorite artworks</h1>
                <div className="image-card">
                    {images.map(image => (
                        <div key={image.id}>
                            {/* <p>
                                    {user.first} {user.last}
                                </p> */}
                            <img className="image-pic-post" src={image.pic} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
