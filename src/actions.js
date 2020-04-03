import axios from "axios";
import { bindActionCreators } from "redux";

export async function receiveFriendsWannabes() {
    console.log("get friends and wannabes is running");
    const { data } = await axios.get("/friends-wannabes");
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friends: data
    };
}
export async function unfriend(userId) {
    console.log("delete friends action is running");
    const { data } = await axios.post("/deletefriendship/" + userId);
    console.log("data", data);
    return {
        type: "DELETE_FRIENDS",
        deletefriend: data
    };
}

export async function acceptfriendship(userId) {
    console.log("accept friends action is running");
    const { data } = await axios.post("/acceptfriendship/" + userId);
    console.log("data", data);
    return {
        type: "ACCEPT_FRIENDS",
        acceptfriend: data
    };
}

// import { chatMessages, chatMessage } from "./actions";
export async function chatMessages(msgs) {
    console.log("chatMessages is running: " + msgs);
    return {
        type: "GET_MESSAGES",
        messages: msgs
    };
}

export async function chatMessage(msg) {
    console.log("chatMessage is running");
    return {
        type: "GET_MESSAGE",
        message: msg
    };
}

export async function onlineUsers(listOfOnlineUsers) {
    console.log("listOfOnlineUsers running");
    return {
        type: "GET_ONLINE_USERS",
        onlineUsers: listOfOnlineUsers
    };
}

export async function userJoined(userWhoJoined) {
    return {
        type: "USER_JOINED",
        userJoined: userWhoJoined
    };
}
