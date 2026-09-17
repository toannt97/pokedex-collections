import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PokemonGroupsModal } from ".";

const PIKACHU = { id: 25, name: "pikachu", spriteUrl: null };
const GROUPS = [
  { id: "a", name: "Starters" },
  { id: "b", name: "Electric" },
  { id: "c", name: "Team" },
];

describe("PokemonGroupsModal", () => {
  it.each([
    [[], "#0025 · in 0 groups"],
    [["a"], "#0025 · in 1 group"],
    [["a", "b"], "#0025 · in 2 groups"],
  ])("describes a Pokémon in groups %j as “%s”", (selectedGroupIds, description) => {
    render(
      <PokemonGroupsModal
        pokemon={PIKACHU}
        groups={GROUPS}
        selectedGroupIds={selectedGroupIds}
        onClose={() => {}}
        onSave={() => {}}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Add pikachu to groups" })).toHaveAccessibleName();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("checks the groups the Pokémon is already in", () => {
    render(
      <PokemonGroupsModal
        pokemon={PIKACHU}
        groups={GROUPS}
        selectedGroupIds={["b"]}
        onClose={() => {}}
        onSave={() => {}}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Starters" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Electric" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Team" })).not.toBeChecked();
  });

  it("saves the checked groups", async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();
    render(
      <PokemonGroupsModal
        pokemon={PIKACHU}
        groups={GROUPS}
        selectedGroupIds={["a", "b"]}
        onClose={() => {}}
        onSave={handleSave}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Starters" }));
    await user.click(screen.getByRole("checkbox", { name: "Team" }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(handleSave).toHaveBeenCalledExactlyOnceWith(["b", "c"]);
  });

  it("closes without saving when cancelled", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    const handleSave = vi.fn();
    render(
      <PokemonGroupsModal
        pokemon={PIKACHU}
        groups={GROUPS}
        selectedGroupIds={[]}
        onClose={handleClose}
        onSave={handleSave}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Starters" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleClose).toHaveBeenCalledOnce();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it("shows an empty state when there are no groups", () => {
    render(
      <PokemonGroupsModal
        pokemon={PIKACHU}
        groups={[]}
        selectedGroupIds={[]}
        onClose={() => {}}
        onSave={() => {}}
      />,
    );

    expect(screen.getByText("No groups yet.")).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
