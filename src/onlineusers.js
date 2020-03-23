// import React, { useEffect, useRef } from "react";
// import axios from "./axios";
// import { socket } from "./socket";
// import { useSelector, useDispatch } from "react-redux";
// import { onlineUsers } from "./actions";

// export default function Onlineusers() {
//     const dispatch = useDispatch();

//     const onlineUsers = useSelector(state => state && state.onlineUsers);
//     console.log("users online", onlineUsers);

//     return (
//         <div className="online-container">
//             <h3 className="friends">Online friends</h3>
//             {onlineUsers &&
//                 onlineUsers.map(listOfUsersOnline => {
//                     return (
//                         <div
//                             className="friendsonline"
//                             key={listOfUsersOnline.id}
//                         >
//                             <img src={listOfUsersOnline.url} />
//                             <p className="friendname">
//                                 {listOfUsersOnline.first}{" "}
//                                 {listOfUsersOnline.last}
//                             </p>
//                         </div>
//                     );
//                 })}
//         </div>
//     );
// }
