import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsWannabes, unfriend, acceptfriendship } from "./actions";

export default function Friendsandwannabe() {
    const dispatch = useDispatch();
    const friendsandWannabes = useSelector(state => state.friendsandWannabes);

    const friends = useSelector(
        state =>
            state.friendsandWannabes &&
            state.friendsandWannabes.filter(user => user.accepted == true)
    );
    const wannabes = useSelector(
        state =>
            state.friendsandWannabes &&
            state.friendsandWannabes.filter(user => user.accepted == false)
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    console.log("friends", friends);
    console.log("friendsandWannabes", friendsandWannabes);

    // if (!users) {
    //     return null;
    // }

    return (
        <div className="background-users">
            <div className="friends">
                {friends && friends.length > 0 && (
                    <h1>
                        {friends && friends.length == 1
                            ? "You currently have 1 friend:"
                            : `You currently have ${friends.length} friends:`}
                    </h1>
                )}
                {/* <div className="background-users"> */}
                {/* <div className="friends"> */}

                <div className="friends-img">
                    {friends &&
                        friends.map((friends, id) => {
                            return (
                                <div className="user" key={id}>
                                    <p>
                                        {friends.first} {friends.last}
                                    </p>
                                    <img
                                        className="image-pic"
                                        src={friends.url || "images/avatar.jpg"}
                                    />
                                    <button
                                        value={friends.id}
                                        onClick={() =>
                                            dispatch(unfriend(friends.id))
                                        }
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            );
                        })}
                </div>

                <div className="wannabes">
                    {wannabes && wannabes.length > 0 && (
                        <h1>
                            {wannabes && wannabes.length == 1
                                ? "You currently have 1 pending friend request:"
                                : `You currently have ${wannabes.length} pending friend requests:`}
                        </h1>
                    )}
                    <div className="friends-img">
                        {wannabes &&
                            wannabes.map((wannabes, id) => {
                                return (
                                    <div className="user" key={id}>
                                        <p>
                                            {wannabes.first} {wannabes.last}
                                        </p>
                                        <img
                                            className="image-pic"
                                            src={
                                                wannabes.url ||
                                                "images/avatar.jpg"
                                            }
                                        />
                                        <button
                                            value={wannabes.id}
                                            onClick={() =>
                                                dispatch(
                                                    acceptfriendship(
                                                        wannabes.id
                                                    )
                                                )
                                            }
                                        >
                                            accept friendship
                                        </button>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
