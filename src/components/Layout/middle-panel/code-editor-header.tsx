import { useFiles } from "@/contexts";

export const CodeEditorHeader = () => {
  const { currentFile, setCurrentFile } = useFiles();

  if (!currentFile)
    return (
      <section className="px-4 py-2 bg-topbar-background text-topbar-foreground font-mono text-sm border-b border-border h-9"></section>
    );

  return (
    <div className="px-4 py-2 bg-topbar-background text-topbar-foreground font-mono text-sm border-b border-border flex items-center justify-between">
      {currentFile.path}
      <i
        onClick={() => setCurrentFile(null)}
        title="Close file"
        className="pi pi-times text-xs hover:text-indigo-400 cursor-pointer"
      ></i>
    </div>
  );
};
