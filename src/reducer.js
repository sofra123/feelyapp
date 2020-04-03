// import { acceptFriendRequest } from "../db";

export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsandWannabes: action.friends
        };
    }

    if (action.type == "DELETE_FRIENDS") {
        state = {
            ...state,
            friendsandWannabes: state.friendsandWannabes.filter(user => {
                user.id != action.deletefriend;
            })
        };
    }

    if (action.type == "ACCEPT_FRIENDS") {
        console.log("accept friendship", action);
        state = {
            ...state,
            friendsandWannabes: state.friendsandWannabes.map(user => {
                if (user.id == action.acceptfriend) {
                    return {
                        ...user,
                        accepted: true
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "GET_MESSAGES") {
        console.log("GET_MESSAGES in reducer: ", action);
        state = {
            ...state,
            messages: action.messages
        };
    }

    if (action.type == "GET_MESSAGE") {
        console.log("GET_MESSAGE in reducer: ", action);
        state = {
            ...state,
            messages: [...state.messages, action.message]
        };
    }

    if (action.type == "GET_ONLINE_USERS") {
        console.log("GET_ONLINE_USERS in reducer", action);
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type == "USER_JOINED") {
        return {
            ...state,
            onlineUsers: [...state.onlineUsers, action.userJoined]
        };
    }

    return state;
}

// enough to create the store
//we don´t pass explicitly the argument. Reducer is called automatically. Dispatch creates the action and passes action to reducer

//action type CHANGE
// action.js
//dispatch takes action (object )and passes to reducer
//reduce actual thing that changes the state

//reducer changes immutably. Everything done in the reducer immutably. NO push pop shift. (add something to arary immutably)
// map, filter, slice, concat
//code for reducer in reducer.js

//useSelector in the component
//action.js function() {
//   return axios.get
//}

//when component mounts dispatch
