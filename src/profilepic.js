import React from "react";
import axios from "./axios";

export default function Profilepic(props) {
    console.log("props is: ", props);
    return (
        <div className="profilepic">
            <img
                src={props.url || "images/avatar.jpg"}
                alt={props.first}
                onClick={props.showUploader}
            />

            <p>
                {props.first} {props.last}
            </p>
        </div>
    );
}
