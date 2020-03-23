import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditor: false,
            bio: "",
            first: props.first
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.displayEditor = this.displayEditor.bind(this);
        this.addButton = this.addButton.bind(this);
        this.editButton = this.editButton.bind(this);
        this.textarea = this.textarea.bind(this);
    }

    componentDidMount() {
        console.log("this.state inside Bio editor", this.state);
        console.log("this.props  inside Bio editor", this.props);
    }

    displayEditor() {
        this.setState({ showEditor: true });
    }

    handleChange(e) {
        console.log(e.target.value, "e.target.value");
        this.setState({ bio: e.target.value });
    }

    handleSubmit() {
        event.preventDefault();
        const { setBio } = this.props;
        const bio = this.state.bio;
        console.log("inside handle function");

        // setBio(bio);
        // console.log("bio", bio);
        // this.setState({ showEditor: false });

        axios
            .post("/bio", { bio: this.state.bio })
            .then(response => {
                // console.log(
                //     "bioeditor.js handleClick axios.post /bio then response: ",
                //     response
                // );
                console.log("bio inside handlesubmit: ", bio);
                setBio(bio);
                // this.props.setBio(response.data.rows[0].bio);
                console.log("bio", bio);
                this.setState({ showEditor: false });
            })
            .catch(err => {
                console.log(
                    "bioeditor.js handleClick axios.post /bio catch err: ",
                    err
                );
            });
    }

    addButton() {
        return (
            <div>
                <button onClick={this.displayEditor}>Add Bio</button>
            </div>
        );
    }

    editButton() {
        return (
            <div>
                {this.props.bio}

                <button onClick={this.displayEditor}>Edit Bio</button>
            </div>
        );
    }

    textarea(props) {
        const { bio } = this.props;
        return (
            <div>
                <textarea
                    className="textarea"
                    rows={7}
                    cols={50}
                    name={bio}
                    onChange={this.handleChange}
                    placeholder="enter your bio here..."
                    value={this.bio}
                ></textarea>
                <button onClick={this.handleSubmit}>save</button>
            </div>
        );
    }

    render() {
        const { bio } = this.props;

        const button = bio ? this.editButton() : this.addButton();

        return (
            <div>
                <div className="bio-container">
                    {this.state.showEditor && this.textarea()}
                </div>
                <div className="bio-btn"> {button}</div>
            </div>
        );
    }
}
