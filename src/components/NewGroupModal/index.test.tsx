import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NewGroupModal } from ".";

const renderModal = (existingGroupNames: string[] = []) => {
  const handleClose = vi.fn();
  const handleCreate = vi.fn();
  render(
    <NewGroupModal
      existingGroupNames={existingGroupNames}
      onClose={handleClose}
      onCreate={handleCreate}
    />,
  );
  return {
    user: userEvent.setup(),
    nameInput: screen.getByRole("textbox", { name: "Group name" }),
    createButton: screen.getByRole("button", { name: "Create group" }),
    handleClose,
    handleCreate,
  };
};

describe("NewGroupModal", () => {
  it("disables creating until the name has more than whitespace", async () => {
    const { user, nameInput, createButton } = renderModal();

    expect(createButton).toBeDisabled();

    await user.type(nameInput, "   ");
    expect(createButton).toBeDisabled();

    await user.type(nameInput, "Starters");
    expect(createButton).toBeEnabled();
  });

  it("creates the group with the trimmed name", async () => {
    const { user, nameInput, createButton, handleCreate } = renderModal();

    await user.type(nameInput, "  Starters  ");
    await user.click(createButton);

    expect(handleCreate).toHaveBeenCalledExactlyOnceWith("Starters");
  });

  it("creates the group when Enter is pressed", async () => {
    const { user, nameInput, handleCreate } = renderModal();

    await user.type(nameInput, "Starters{Enter}");

    expect(handleCreate).toHaveBeenCalledExactlyOnceWith("Starters");
  });

  it("rejects a name that already exists, ignoring case and surrounding spaces", async () => {
    const { user, nameInput, createButton, handleCreate } = renderModal(["Starters "]);

    await user.type(nameInput, " starters{Enter}");

    expect(screen.getByRole("alert")).toHaveTextContent("A group named “starters” already exists.");
    expect(nameInput).toBeInvalid();
    expect(createButton).toBeDisabled();
    expect(handleCreate).not.toHaveBeenCalled();
  });

  it("limits the name to 40 characters", async () => {
    const { user, nameInput } = renderModal();

    await user.type(nameInput, "a".repeat(45));

    expect(nameInput).toHaveValue("a".repeat(40));
  });

  it("closes without creating when cancelled", async () => {
    const { user, nameInput, handleClose, handleCreate } = renderModal();

    await user.type(nameInput, "Starters");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleClose).toHaveBeenCalledOnce();
    expect(handleCreate).not.toHaveBeenCalled();
  });
});
