import pokeballPlaceholder from "@assets/images/pokeball-placeholder.svg";
import { useState } from "react";

import { Button } from "../Button";
import { Modal } from "../Modal";
import styles from "./index.module.scss";

type GroupOption = {
  id: string;
  name: string;
  disabled?: boolean;
};

type PokemonGroupsModalProps = {
  pokemon: {
    id: number;
    name: string;
    spriteUrl: string | null;
  };
  groups: GroupOption[];
  selectedGroupIds: string[];
  onClose: () => void;
  onSave: (groupIds: string[]) => void;
};

export const PokemonGroupsModal = ({
  pokemon,
  groups,
  selectedGroupIds,
  onClose,
  onSave,
}: PokemonGroupsModalProps) => {
  const [checkedGroupIds, setCheckedGroupIds] = useState(selectedGroupIds);

  const toggleGroup = (groupId: string) => {
    setCheckedGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId],
    );
  };

  const groupCount = selectedGroupIds.length;

  return (
    <Modal
      divided
      media={
        <img
          src={pokemon.spriteUrl ?? pokeballPlaceholder}
          alt=""
          onError={(event) => {
            event.currentTarget.src = pokeballPlaceholder;
          }}
          className={styles["pokemon-groups-modal__sprite"]}
        />
      }
      title={
        <>
          Add <span className={styles["pokemon-groups-modal__name"]}>{pokemon.name}</span> to groups
        </>
      }
      description={`#${String(pokemon.id).padStart(4, "0")} · in ${groupCount} ${groupCount === 1 ? "group" : "groups"}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(checkedGroupIds)}>Save changes</Button>
        </>
      }
    >
      {groups.length > 0 ? (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <label className={styles["pokemon-groups-modal__option"]}>
                <input
                  type="checkbox"
                  checked={checkedGroupIds.includes(group.id)}
                  disabled={group.disabled}
                  onChange={() => toggleGroup(group.id)}
                  className={styles["pokemon-groups-modal__checkbox"]}
                />
                {group.name}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles["pokemon-groups-modal__empty"]}>No groups yet.</p>
      )}
    </Modal>
  );
};
