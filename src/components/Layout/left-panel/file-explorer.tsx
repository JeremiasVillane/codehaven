import { useExplorer, useFiles } from "@/contexts";
import { buildPrimeTree } from "@/helpers";
import { useIsMobile } from "@/hooks";
import { ContextMenu } from "primereact/contextmenu";
import { Tree, TreeDragDropEvent } from "primereact/tree";
import { useEffect, useMemo, useRef } from "react";
import { getContextMenuItems } from "./file-explorer-context-menu";
import {
  handleBackgroundClick,
  handleFileClick,
} from "./file-explorer-handlers";

export function FileExplorer() {
  const isMobile = useIsMobile();
  const { files, currentDirectory, setCurrentDirectory } = useFiles();

  const {
    nodes,
    setNodes,
    isCreating,
    isCreatingFolder,
    newFileName,
    selectedKey,
    expandedKeys,
    setExpandedKeys,
    setSelectedKey,
  } = useExplorer();

  const inputRef = useRef<HTMLInputElement>(null);
  const cm = useRef<ContextMenu>(null);

  const memoizedTree = useMemo(
    () => buildPrimeTree(files),
    [files, currentDirectory, isCreating, isCreatingFolder, newFileName]
  );

  useEffect(() => {
    setNodes(memoizedTree);
  }, [memoizedTree, setNodes]);

  const nodeTemplate = (node: any) => {
    if (node.data?.isCreation) {
      return node.data.creationElement;
    }
    return node.label;
  };

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  const onDragDrop = (event: TreeDragDropEvent) => {
    setNodes(event.value);
  };

  return (
    <>
      <ContextMenu model={getContextMenuItems()} ref={cm} />

      <aside className="w-full md:w-30rem" onClick={handleBackgroundClick}>
        <Tree
          value={nodes}
          expandedKeys={expandedKeys}
          onToggle={(e) => setExpandedKeys(e.value)}
          selectionMode="single"
          selectionKeys={selectedKey}
          onNodeClick={(e) => handleFileClick(e.node.data, isMobile)}
          onSelectionChange={(e) => {
            setSelectedKey(e.value as string);
            if (!e.value) {
              setCurrentDirectory(null);
            }
          }}
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
          nodeTemplate={nodeTemplate}
          className="w-full rounded-none bg-sidebar-background overflow-y-auto"
          style={{
            height: "calc(100vh - var(--header-height) - var(--topbar-height))",
          }}
        />
      </aside>
    </>
  );
}
