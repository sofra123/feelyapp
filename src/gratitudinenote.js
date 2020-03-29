import axios from "./axios";
import React, { useState, useEffect } from "react";
import Moment from "react-moment";

export default function Gratitudenote(props) {
  const [notes, setNotes] = useState([]);
  console.log("notes", notes);

  useEffect(() => {
    axios
      .get("/getgratitude")
      .then(({ data }) => {
        console.log("getpictures GET /users results: ", data);
        setNotes(data.rows);
      })
      .catch(err => {
        console.log("getpictures GET /users catch err: ", err);
      });
  }, [props]);

  return (
    <div className="gratitude-form">
      {/* <h1>Your gratitude thoughts</h1> */}
      <ul>
        {" "}
        {notes.map(note => (
          <li key={note.id}>
            <h2>
              <Moment format="YYYY/MM/DD">{note.created_at}</Moment>{" "}
            </h2>
            <p> {note.gratitude} </p>
          </li>
        ))}{" "}
      </ul>
    </div>
  );
}
