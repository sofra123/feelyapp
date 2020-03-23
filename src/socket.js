import * as io from "socket.io-client";

import { chatMessages, chatMessage, onlineUsers, userJoined } from "./actions";

export let socket;

export const init = store => {
    console.log("socket" + socket);
    if (!socket) {
        console.log("socket is not null");

        socket = io.connect();

        socket.on("onlineUsers", listOfOnlineUsers => {
            console.log("on onlineUsers ", listOfOnlineUsers);

            store.dispatch(onlineUsers(listOfOnlineUsers));
        });

        socket.on("userJoined", userWhoJoined => {
            console.log("on user who joined ", userWhoJoined);
            store.dispatch(userJoined(userWhoJoined));
        });

        socket.on("chatMessages", msgs => {
            console.log("onChatMessages", msgs);
            store.dispatch(chatMessages(msgs));
        });

        socket.on("chatMessage", msg => {
            console.log("onChatMessage", msg);
            store.dispatch(chatMessage(msg));
        });
    } else {
        console.log("socket is null");
    }
};
