import { useApp, useFiles } from "@/contexts";
import { initializeProjectTerminals } from "@/helpers";
import { cn } from "@/utils";
import { Button } from "primereact/button";

export function RunButton({ isHidden }: { isHidden: boolean }) {
  const { setActivePanel } = useApp();
  const { files } = useFiles();

  const handleRun = () => {
    initializeProjectTerminals();
    setActivePanel("preview");
  };

  return (
    <Button
      title="Run the current project"
      onClick={handleRun}
      className={cn(
        "primary-button",
        "text-indigo-600 md:text-white h-6 px-0.5 md:px-3 text-xs md:text-sm flex items-center gap-2 bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent shadow-none md:shadow-sm md:bg-indigo-700 md:dark:bg-indigo-900 md:hover:bg-indigo-600 md:dark:hover:bg-indigo-800",
        isHidden ? "hidden" : ""
      )}
      disabled={files.length < 1}
    >
      <i className="pi pi-play-circle" />{" "}
      <span className="hidden md:flex">Run</span>
    </Button>
  );
}
