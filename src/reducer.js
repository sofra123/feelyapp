export default function reducer(state = {}, action) {
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

  if (action.type == "WALL_POSTS") {
    console.log("wallposts from reducer:", action.posts);

    state = {
      ...state,
      posts: action.posts
    };
  }

  if (action.type == "NEW_WALL_POST") {
    console.log("new wall post from reducer:", action.newPost);

    state = {
      ...state,
      posts: [action.newPost, ...state.posts]
    };
  }
  return state;
}
