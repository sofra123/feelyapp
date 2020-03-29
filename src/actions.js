import axios from "axios";
import { bindActionCreators } from "redux";

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

export async function getWallPosts(otherUserId) {
  const { data } = await axios.get(`/wallPosts/${otherUserId}`);
  console.log("data from wall posts", data);

  return {
    type: "WALL_POSTS",
    posts: data
  };
}

export async function newWallPost(otherUserId, post) {
  console.log("info from action***, ", otherUserId, post);
  const { data } = await axios.post(`/wallPost/${otherUserId}/${post}`);
  console.log("data from action:", data);
  return {
    type: "NEW_WALL_POST",
    newPost: data
  };
}
