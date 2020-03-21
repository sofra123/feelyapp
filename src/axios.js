import axios from "axios";

var copy = axios.create({
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "csrf-token"
});

export default copy;
