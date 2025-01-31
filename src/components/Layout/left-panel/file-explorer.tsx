import { ContextMenu } from "primereact/contextmenu";
import { Tree, TreeDragDropEvent } from "primereact/tree";
import { useEffect, useRef } from "react";

import { useFiles } from "@/contexts/FileContext";
import { buildPrimeTree } from "@/helpers";

import { InputText } from "primereact/inputtext";

import { useApp } from "@/contexts/AppContext";
import { Button } from "primereact/button";
import { contextMenuItems } from "./file-explorer-context-menu";
import {
  handleFileClick,
  handleKeyDown,
  handleSubmit,
} from "./file-explorer-handlers";

export function FileExplorer() {
  const { files } = useFiles();

  const {
    nodes,
    setNodes,
    isCreating,
    setIsCreating,
    isCreatingFolder,
    setNewFileName,
    newFileName,
    selectedKey,
    expandedKeys,
    setExpandedKeys,
    setSelectedKey,
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);
  const cm = useRef<ContextMenu>(null);

  useEffect(() => {
    const tree = buildPrimeTree(files);
    setNodes(tree);
  }, [files]);

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // --------------------------------------------------------
  const onDragDrop = (event: TreeDragDropEvent) => {
    setNodes(event.value);
    // ...
  };

  return (
    <>
      <ContextMenu model={contextMenuItems} ref={cm} />

      <aside className="w-full md:w-30rem">
        {isCreating && (
          <form
            onSubmit={handleSubmit}
            className="flex items-center justify-between gap-3 px-6 py-3"
          >
            <InputText
              ref={inputRef}
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isCreatingFolder ? "Folder name" : "filename.ext"}
              className="bg-gray-800 text-white"
            />

            <div className="flex items-center gap-3">
              <Button type="submit" className="rounded-none">
                <i
                  className="pi pi-check text-gray-600 hover:text-indigo-700 text-sm"
                  title="Create"
                ></i>
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewFileName("");
                }}
                className="rounded-none"
              >
                <i
                  className="pi pi-times text-gray-600 hover:text-indigo-700 text-sm"
                  title="Cancel"
                ></i>
              </Button>
            </div>
          </form>
        )}

        <Tree
          value={nodes}
          expandedKeys={expandedKeys}
          onToggle={(e) => setExpandedKeys(e.value)}
          selectionMode="single"
          selectionKeys={selectedKey}
          onNodeClick={(e) => handleFileClick(e.node.data)}
          onSelectionChange={(e) => setSelectedKey(e.value as string)}
          contextMenuSelectionKey={selectedKey}
          onContextMenuSelectionChange={(e) =>
            setSelectedKey(e.value as string)
          }
          onContextMenu={(e) => cm.current?.show(e.originalEvent)}
          dragdropScope="codehaven"
          onDragDrop={onDragDrop}
          filter
          filterMode="strict"
          filterPlaceholder="Search..."
          emptyMessage=" "
          className="w-full rounded-none bg-sidebar-background overflow-auto"
          style={{ height: "calc(100vh - var(--header-height) - var(--topbar-height))" }}
        />
      </aside>
    </>
  );
}
