import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { image: null };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ image: event.target.files[0] });
    }
    handleSubmit(event) {
        event.preventDefault();
        const imageFile = this.state.image;
        // console.log("s3 object", s3);

        var formData = new FormData();
        formData.append("file", imageFile);

        axios
            .post("/upload", formData)
            .then(response => {
                this.props.finishedUploading(response.data.result.rows[0].url);
            })
            .catch(function(err) {
                console.log("err in POST /upload: ", err);
            });
    }

    render() {
        console.log("this.props: ", this.props);

        return (
            <div className="Uploader">
                <span onClick={this.props.hideUploader}>x</span>
                <h3>Do you want to change pic?</h3>

                <form id="uploader-form" onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                    <button type="submit">Upload</button>
                </form>
            </div>
        );
    }
}
