import { useSpace } from "@ably/spaces/dist/mjs/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MAX_NAME_LENGTH } from "./avatars-constants";
import { colorFromName } from "./avatars-helpers";
import { useState } from "react";

export default function ChangeNameModal({
  showModal,
  setShowModal,
  newName,
  setNewName,
}: {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  newName: string;
  setNewName: (val: string) => void;
}) {
  const { space } = useSpace();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setNewName("");
  };

  const handleSave = async () => {
    setIsLoading(true);
    let finalName = newName.trim().toLowerCase().replace(/\s+/g, "_");

    if (finalName.length > MAX_NAME_LENGTH) {
      finalName = finalName.slice(0, MAX_NAME_LENGTH);
    }

    if (space) {
      await space.updateProfileData({
        name: finalName,
        memberColor: colorFromName(finalName),
      });
    }

    localStorage.setItem("codehaven:presence-userName", finalName);

    setIsLoading(false);
    setShowModal(false);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog
        visible={showModal}
        onHide={handleClose}
        header={
          <header>
            <div className="flex items-center text-foreground">
              Change your name
            </div>
          </header>
        }
        headerClassName="p-3 bg-sidebar-background"
        resizable={false}
        modal
        dismissableMask
      >
        <article className="flex flex-col px-3">
          <InputText
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            className="my-3"
            disabled={isLoading}
          />

          <section className="flex justify-end gap-2 mt-3">
            <Button
              className="px-4 py-1.5 text-sm bg-gray-400 text-white rounded-md"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading && <i className="pi pi-spin pi-spinner mr-2" />}
              Save
            </Button>
          </section>
        </article>
      </Dialog>
    </div>
  );
}
