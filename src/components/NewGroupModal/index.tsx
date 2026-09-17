import { type FormEvent, useId, useState } from "react";

import { Button } from "../Button";
import { Modal } from "../Modal";
import { TextInput } from "../TextInput";
import styles from "./index.module.scss";

const MAX_NAME_LENGTH = 40;

type NewGroupModalProps = {
  existingGroupNames: string[];
  onClose: () => void;
  onCreate: (name: string) => void;
};

export const NewGroupModal = ({ existingGroupNames, onClose, onCreate }: NewGroupModalProps) => {
  const formId = useId();
  const [name, setName] = useState("");

  const trimmedName = name.trim();
  const isDuplicate = existingGroupNames.some(
    (existingName) => existingName.trim().toLowerCase() === trimmedName.toLowerCase(),
  );
  const errorMessage =
    trimmedName && isDuplicate ? `A group named “${trimmedName}” already exists.` : undefined;
  const canCreate = trimmedName.length > 0 && !isDuplicate;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canCreate) onCreate(trimmedName);
  };

  return (
    <Modal
      title="New group"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={!canCreate}>
            Create group
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit}>
        <TextInput
          label="Group name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={MAX_NAME_LENGTH}
          autoComplete="off"
          errorMessage={errorMessage}
          data-autofocus
        />
        <p className={styles["new-group-modal__hint"]}>Up to {MAX_NAME_LENGTH} characters.</p>
      </form>
    </Modal>
  );
};
