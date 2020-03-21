import React from "react";
import App from "./app";
import axios from "./axios";
import { render, waitForElement } from "@testing-library/react";
import { JestEnvironment } from "@jest/environment";
import TestRunner from "jest-runner";
import { exportAllDeclaration } from "@babel/types";

jest.mock("./axios");

test("app renders correctly", () => {
    axios.get.mockResolvedValue({
        data: {
            id: 1,
            first: "ivana",
            last: "Matjevic",
            url: "./matjevic.jpg"
        }
    });
    const { container } = render(<App />);


    await waitForElement(()=> container.querySelector('div'))


    console.log(container.innerHTML);

    expect(container.innerHTML).toContain("<div>")
});
