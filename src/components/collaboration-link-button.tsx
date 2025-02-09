import { useIsMobile } from "@/hooks";
import { cn } from "@/utils";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast, ToastMessage } from "primereact/toast";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function CollaborationLinkButton({ isHidden }: { isHidden: boolean }) {
  const isMobile = useIsMobile();
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(false);
  const [collabLink, setCollabLink] = useState("");

  const showToast = (props: ToastMessage) => {
    toast.current?.show({ ...props });
  };

  const handleGenerateLink = () => {
    const searchParams = new URLSearchParams(window.location.search);
    let room = searchParams.get("room");

    if (!room) {
      room = uuidv4();
      searchParams.set("room", room);

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }

    setCollabLink(window.location.href);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(collabLink);
      showToast({
        severity: "success",
        summary: "Success",
        detail: "Share link copied to clipboard!",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Failed to copy link. Please try again.",
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Toast ref={toast} />
      <Button
        title="Share project"
        onClick={() => setVisible(true)}
        className={cn(
          "primary-button",
          "text-indigo-600 md:text-white h-6 px-0.5 md:px-3 text-xs md:text-sm flex items-center gap-2 bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent shadow-none md:shadow-sm md:bg-indigo-700 md:dark:bg-indigo-900 md:hover:bg-indigo-600 md:dark:hover:bg-indigo-800 mr-1 md:mr-0",
          isHidden ? "hidden" : ""
        )}
      >
        <i className="pi pi-share-alt text-base md:text-[1em]" />{" "}
        <span className="hidden md:flex">Share</span>
      </Button>

      <Dialog
        header={
          <header>
            <div className="text-foreground">Share Project</div>
          </header>
        }
        headerClassName="p-3 pl-6 bg-sidebar-background"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <article className="sm:max-w-md space-y-4">
          <section className="leading-6 py-2 text-pretty">
            Generate a link to invite someone to collaborate on this project.
          </section>

          <section className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <label htmlFor="link" className="sr-only">
                Link
              </label>

              <InputText
                id="link"
                value={collabLink}
                readOnly
                className="w-full border border-border"
              />
            </div>

            <Button
              title="Copy link"
              type="submit"
              className="px-3"
              onClick={handleCopyLink}
            >
              <span className="sr-only">Copy</span>
              <i className="pi pi-clone" />
            </Button>
          </section>

          <Button
            onClick={handleGenerateLink}
            className="primary-button"
            disabled={!!collabLink}
          >
            Generate Share Link
          </Button>
        </article>
      </Dialog>
    </div>
  );
}
