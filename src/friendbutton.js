import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        axios
            .get("/api/friends/" + props.otherUser)
            .then(({ data }) => {
                console.log("friendbutton.js GET /api/friends/ ", { data });
                console.log(
                    "friendbutton.js GET /api/friends/2 ",
                    data.results
                );

                console.log(
                    "friendbutton.js GET /api/friends/3 ",
                    data.results.rows
                );

                console.log("props.otherUser", props.otherUser);

                if (data.results.rows[0] === undefined) {
                    console.log("friendship undefined");
                    setButtonText("Add Friend");
                } else if (data.results.rows[0].accepted === true) {
                    setButtonText("Unfriend");
                } else if (
                    !data.results.rows[0].accepted
                    // data.results.rows[0].receiver_id === data.ownUserId
                ) {
                    console.log("data.friendship.accepted");
                    // console.log(
                    //     "data.receiver_id",
                    //     data.results.rows[0].receiver_id
                    // );
                    // console.log("userId", data.ownUserId);
                    setButtonText("Accept Friend Request");
                } else if (
                    !data.results.rows[0].accepted &&
                    data.results.rows[0].receiver_id === data.ownUserId
                ) {
                    setButtonText("Cancel Friend Request");
                }
            })
            .catch(err => {
                console.log("FriendButton GET /api/friends/ catch err: ", err);
            });
    }, []);

    function handleClick(e) {
        e.preventDefault();
        if (buttonText === "Add Friend") {
            axios
                .post("/api/friendshiprequest/" + props.otherUser)
                .then(({ data }) => {
                    console.log("FriendButton POST /api/friendrequest/ : ", {
                        data
                    });
                    setButtonText("Cancel Friend Request");
                })
                .catch(err => {
                    console.log(
                        "FriendButton.js POST /api/friendrequest/ + props.otherUser catch err: ",
                        err
                    );
                });
        } else if (
            buttonText === "Unfriend" ||
            buttonText === "Cancel Friend Request"
        ) {
            // delete friendship
            axios
                .post("/deletefriendship/" + props.otherUser)
                .then(({ data }) => {
                    console.log(
                        "FriendButton.js POST /api/deletefriend/ + props.otherUser  ",
                        data.rows[0]
                    );
                    setButtonText("Add Friend");
                })
                .catch(err => {
                    console.log(
                        "FriendButton.js POST /api/deletefriend/ + props.otherUser catch err: ",
                        err
                    );
                });
        } else if (buttonText === "Accept Friend Request") {
            // add friend
            axios
                .post("/acceptfriendship/" + props.otherUser)
                .then(({ data }) => {
                    console.log(
                        "FriendButton.js POST /api/acceptfriend/ + props.otherUser: ",
                        data
                    );
                    setButtonText("Unfriend");
                })
                .catch(err => {
                    console.log(
                        "FriendButton.js POST /api/acceptfriend/ + props.otherUser catch err: ",
                        err
                    );
                });
        }
    }

    return (
        <div>
            <button onClick={handleClick}>{buttonText}</button>
        </div>
    );
}
