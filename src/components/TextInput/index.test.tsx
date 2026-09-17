import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { TextInput } from ".";

describe("TextInput", () => {
  it("labels the input", () => {
    render(<TextInput label="Group name" />);

    expect(screen.getByRole("textbox", { name: "Group name" })).toBeInTheDocument();
  });

  it("marks the input invalid and describes it with the error message", () => {
    render(
      <>
        <p id="hint">Up to 40 characters.</p>
        <TextInput label="Group name" aria-describedby="hint" errorMessage="Name is taken." />
      </>,
    );

    const input = screen.getByRole("textbox", { name: "Group name" });
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("Up to 40 characters. Name is taken.");
    expect(screen.getByRole("alert")).toHaveTextContent("Name is taken.");
  });

  it("only shows the clear button once there's a value", async () => {
    const user = userEvent.setup();
    render(<TextInput label="Search" clearable />);

    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Search" }), "pika");

    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("hides the clear button when the input is read-only", () => {
    render(<TextInput label="Search" clearable readOnly defaultValue="pika" />);

    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("clears an uncontrolled input and focuses it", async () => {
    const user = userEvent.setup();
    render(<TextInput label="Search" clearable defaultValue="pika" />);

    await user.click(screen.getByRole("button", { name: "Clear" }));

    const input = screen.getByRole("textbox", { name: "Search" });
    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("clears a controlled input through onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const ControlledInput = () => {
      const [value, setValue] = useState("pika");
      return (
        <TextInput
          label="Search"
          clearable
          value={value}
          onChange={(event) => {
            handleChange(event.target.value);
            setValue(event.target.value);
          }}
        />
      );
    };
    render(<ControlledInput />);

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(handleChange).toHaveBeenCalledWith("");
    expect(screen.getByRole("textbox", { name: "Search" })).toHaveValue("");
  });
});
