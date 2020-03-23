import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [matchingUsers, setMatchingUsers] = useState();

    useEffect(() => {
        axios
            .get("/lastusers")
            .then(({ data }) => {
                console.log("FindPeople GET /users results: ", data);

                setUsers(data.rows);
            })
            .catch(err => {
                console.log("FindPeople GET /users catch err: ", err);
            });
    }, []);

    useEffect(() => {
        // const matchingUsers = this.props.match.params.id;
        if (!matchingUsers) {
            return;
        } else {
            axios
                .get(`/matchingusers/${matchingUsers}`)
                .then(({ data }) => {
                    console.log(
                        "FindPeople GET /matchingusers results: ",
                        data
                    );

                    // setMatchingUsers(data);
                    setUsers(data);
                })
                .catch(err => {
                    console.log("FindPeople GET /users catch err: ", err);
                });
        }
    }, [matchingUsers]);

    return (
        <div className="background-users">
            <div className="users-container">
                <span>Find other people in our community</span>
                <input
                    type="text"
                    placeholder="Enter name of person you'd like to find"
                    onChange={e => setMatchingUsers(e.target.value)}
                />
            </div>
            <div className="image-card">
                {users.map(user => (
                    <div key={user.id}>
                        <Link to={"/user/" + user.id}>
                            <p>
                                {user.first} {user.last}
                            </p>
                            <img
                                className="image-pic"
                                src={user.url || "images/avatar.jpg"}
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
