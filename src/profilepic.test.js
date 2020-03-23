import React from "react";
import Profilepic from "./profilepic";

import { render, fireEvent } from "@testing-library/react";
import TestRunner from "jest-runner";

test("renders default image when there is no url prop", () => {
    const { container } = render(<Profilepic />);
    // console.log(container.querySelector("img").src);
    expect(container.querySelector("img").src).toContain("/avatar.jpg");
});

test("renders default image with specified url prop", () => {
    const { container } = render(<Profilepic url="/avatar.jpg" />);
    // console.log(container.querySelector("img").src);
    expect(container.querySelector("img").src).toContain("/avatar.jpg");
});

test("renders image with first and last props in alt", () => {
    const { container } = render(<Profilepic first="Francesca" last="Caria" />);
    // console.log(container.querySelector("img").src);
    expect(container.querySelector("img").alt).toContain(" ivana matjevic");
});

test("renders image with first and last props in alt", () => {
    const onClick = jest.fn(); //tells if the fn is called when I want to be called. (Click on img invokes the fn)
    render(<Profilepic onClick={onClick} />);
    // console.log(container.querySelector("img").src);
    const img = container.querySelector("img");
    fireEvent.click(img);
    expect(onClick.mock.call.length).length(1); // because we fired the event once
});
