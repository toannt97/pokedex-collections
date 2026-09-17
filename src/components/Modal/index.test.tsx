import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Modal } from ".";

describe("Modal", () => {
  it("opens as a dialog named by its title and focuses the autofocus element", () => {
    render(
      <Modal title="New group" onClose={() => {}}>
        <input aria-label="Group name" data-autofocus />
      </Modal>,
    );

    expect(screen.getByRole("dialog", { name: "New group" })).toHaveAttribute("open");
    expect(screen.getByRole("textbox", { name: "Group name" })).toHaveFocus();
  });

  it("calls onClose from the close button", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal title="New group" onClose={handleClose}>
        Content
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when the backdrop is pressed, but not the content", () => {
    const handleClose = vi.fn();
    render(
      <Modal title="New group" onClose={handleClose}>
        Content
      </Modal>,
    );

    fireEvent.pointerDown(screen.getByText("Content"));
    expect(handleClose).not.toHaveBeenCalled();

    fireEvent.pointerDown(screen.getByRole("dialog"));
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("returns focus to the element that opened it when it unmounts", () => {
    const renderPage = (isOpen: boolean) => (
      <>
        <button type="button">New group</button>
        {isOpen && (
          <Modal title="New group" onClose={() => {}}>
            <input aria-label="Group name" data-autofocus />
          </Modal>
        )}
      </>
    );
    const { rerender } = render(renderPage(false));
    const opener = screen.getByRole("button", { name: "New group" });
    opener.focus();

    rerender(renderPage(true));
    expect(opener).not.toHaveFocus();

    rerender(renderPage(false));
    expect(opener).toHaveFocus();
  });
});
