import React, { Component } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import * as moment from "moment";
import Sentimentscore from "./sentimentscore";

export default class Sentimentchart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sentimentScore: ""
    };
  }

  componentDidMount() {
    axios
      .get("/getsentimentscore") // You can simply make your requests to "/api/whatever you want"
      .then(response => {
        console.log("response chart", response);

        const datasentiment = response.data.map(a => a.sentiment_score);
        let newdatasentiment2 = datasentiment.map(val => parseFloat(val, 10));

        let timesentiment = response.data.map(a => a.created_at);
        let newtimesentiment2 = timesentiment.map(function(d) {
          return new Date(d).toLocaleDateString("en-US");
        });
        let newdatasentiment = newdatasentiment2.reverse();
        let newtimesentiment = newtimesentiment2.reverse();

        console.log("datasentiment", newdatasentiment.reverse());
        console.log("datasentiment", newtimesentiment.reverse());

        this.setState({
          sentimenentforchart: newdatasentiment,
          timeforchart: newtimesentiment
        });
      });
  }

  render() {
    console.log("this.state.sentimentforchart", this.state.sentimenentforchart);
    const state = {
      labels: this.state.timeforchart,
      datasets: [
        {
          label: "Sentiment Score",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: this.state.sentimenentforchart
        }
      ]
    };

    return (
      <div className="background">
        <div>
          <Line
            data={state}
            options={{
              title: {
                display: true,
                text: "Last 7 days mood",
                fontSize: 20
              },
              legend: {
                display: true,
                position: "right"
              }
            }}
          />
        </div>
      </div>
    );
  }
}
