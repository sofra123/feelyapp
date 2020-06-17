import React from "react";

export default class Dropdown extends React.Component {
  constructor() {
    super();

    this.state = {
      displayMenu: false,
    };

    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
  }

  showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
      document.addEventListener("click", this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener("click", this.hideDropdownMenu);
    });
  }

  render() {
    return (
      <div className="dropdown" style={{ background: "black", width: "110px" }}>
        <div className="button" onClick={this.showDropdownMenu}>
          {" "}
          Menu{" "}
        </div>

        {this.state.displayMenu ? (
          <ul className="uldrop">
            <li>
              <a className="active" href="/chatbot">
                FeelyBot
              </a>
            </li>
            <li className="lidrop">
              <a href="/sentimentchart">Moodchart</a>
            </li>
            <li className="lidrop">
              <a href="/form">Gratitude Journal</a>
            </li>
            <li className="lidrop">
              <a href="/logout">Log Out</a>
            </li>
          </ul>
        ) : null}
      </div>
    );
  }
}
