import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";
import Pictures from "./pictures";

export default class Otherprofile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const otherUsers = this.props.match.params.id;
        axios.get("/api/user/" + otherUsers).then(({ data }) => {
            console.log("data from otherprofile", data);

            if (data.redirectToProfile) {
                this.props.history.push("/");

                // } else if () { // some test to determine a user was not found
                //     this.setState({
                //         error: true
                //     }) ;
            } else {
                this.setState(
                    data,

                    () => console.log("THIS.STATE: ", this.state)
                );
            }
        });
    }

    render() {
        return (
            <div>
                <div className="profile-list">
                    {this.state.user && (
                        <div className="profilepic">
                            <h2>
                                {this.state.user.first} {this.state.user.last}
                            </h2>
                            <img
                                className="pic-list"
                                src={
                                    this.state.user.url || "/images/avatar.jpg"
                                }
                            />
                            <p>{this.state.user.bio}</p>
                        </div>
                    )}
                    <FriendButton otherUser={this.props.match.params.id} />
                    <h1 className="fav">My favorite artworks</h1>
                    <div className="image-card">
                        {this.state.pictures &&
                            this.state.pictures.map(item => {
                                return (
                                    <img
                                        className="image-pic-post"
                                        src={item.pic}
                                    />
                                );
                            })}
                    </div>
                </div>
            </div>
        );
    }
}

// {
//     pictures.map(image => (
//         <div key={image.id}>
//             {/* <p>
//                 {user.first} {user.last}
//             </p> */}
//             <img className="image-pic-post" src={image.pic} />
//         </div>
//     ));
// }
