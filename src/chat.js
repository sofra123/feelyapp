import React, { useEffect, useRef } from "react";
import axios from "./axios";
import { socket } from "./socket";
import { useSelector, useDispatch } from "react-redux";
import { chatMessage, chatMessages } from "./actions";
import Moment from "react-moment";
import { onlineUsers } from "./actions";

export default function Chat(props) {
    const dispatch = useDispatch();

    const messages = useSelector(state => state && state.messages);
    console.log("10 messages", messages);

    const onlineUsers = useSelector(state => state && state.onlineUsers);
    console.log("users online", onlineUsers);

    // console.log("state: " + friendsandWannabes);

    const keyCheck = e => {
        console.log("e.key: ", e.key);
        console.log("chatMessages: " + JSON.stringify(messages));
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("e.target.value: ", e.target.value);
            socket.emit("newMsg", e.target.value);
            e.target.value = "";
        }
    };

    const elemRef = useRef();
    useEffect(() => {
        console.log("chat mounted");
        console.log("elemRef", elemRef.current);
        console.log("scroll top:", elemRef.current.scrollTop);
        console.log("scroll height:", elemRef.current.scrollHeight);
        console.log("client height: ", elemRef.current.clientHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [messages]);

    // console.log("state", state);

    return (
        <div className="chatroom">
            <h1>Chatroom</h1>
            <div className="big-container">
                <div className="chat-container">
                    <div className="chat-messages" ref={elemRef}>
                        {messages &&
                            messages.map((msg, id) => {
                                return (
                                    <div className="msg" key={id}>
                                        <img
                                            src={msg.url || "images/avatar.jpg"}
                                        />
                                        <div className="messages">
                                            <span className="chat-names">
                                                {msg.first} {msg.last}{" "}
                                                <Moment fromNow>
                                                    {msg.created_at}
                                                </Moment>{" "}
                                                says :
                                            </span>
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                    <textarea
                        placeholder="Type your message here. Press Enter to send."
                        onKeyDown={keyCheck}
                    />
                </div>
                <div className="online-container">
                    <h3 className="friends-online">Online users</h3>
                    {onlineUsers &&
                        onlineUsers.map(listOfUsersOnline => {
                            return (
                                <div
                                    className="friendsonline"
                                    key={listOfUsersOnline.id}
                                >
                                    <img
                                        src={
                                            listOfUsersOnline.url ||
                                            "images/avatar.jpg"
                                        }
                                    />
                                    <p className="friendname">
                                        {listOfUsersOnline.first}{" "}
                                        {listOfUsersOnline.last}
                                    </p>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
