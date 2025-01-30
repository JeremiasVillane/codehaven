import { ContextMenu } from "primereact/contextmenu";
import { Toast } from "primereact/toast";
import { Tree, TreeDragDropEvent } from "primereact/tree";
import { TreeNode } from "primereact/treenode";
import { useEffect, useRef, useState } from "react";

import { useFiles } from "@/contexts/FileContext";
import { buildPrimeTree, findNodeByKey } from "@/helpers";
import { FileData } from "@/types";

import { InputText } from "primereact/inputtext";

import { showToast } from "@/helpers";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { AppMenu } from "./components";

export function FileExplorer() {
  const {
    files,
    setCurrentFile,
    createFile,
    deleteFile,
    loadFiles,
    setCurrentDirectory,
  } = useFiles();

  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menu = useRef<Menu>(null);

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
  const handleFileClick = (file: FileData) => {
    if (file.isDirectory) {
      setCurrentDirectory(file.id);
    } else {
    setCurrentFile(file);
    }
  };

  const handleCreateClick = (folder: boolean) => {
    setIsCreating(true);
    setIsCreatingFolder(folder);
    setNewFileName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsCreating(false);
      setNewFileName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFileName.trim();
    if (!name) {
      setIsCreating(false);
      return;
    }

    try {
      let parentIsDir = false;
      let parentId: string | null = null;

      if (selectedKey) {
        const node = findNodeByKey(nodes, selectedKey);
        const fileData = node?.data as FileData;
        if (fileData?.isDirectory) {
          parentIsDir = true;
          parentId = fileData.id;
        } else {
          parentId = fileData?.parentId || null;
        }
      }

      setCurrentDirectory(parentIsDir ? parentId : null);

      await createFile(name, isCreatingFolder);
      await loadFiles();
    } catch (error) {
      showToast(toast, "Error creating element", "error");
    } finally {
      setIsCreating(false);
      setNewFileName("");
    }
  };

  // --------------------------------------------------------
  const menuItems = [
    {
      label: "New file",
      icon: "pi pi-file",
      command: () => handleCreateClick(false),
    },
    {
      label: "New folder",
      icon: "pi pi-folder",
      command: () => handleCreateClick(true),
    },
    {
      separator: true,
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: async () => {
        if (!selectedKey) return;
        try {
          await deleteFile(selectedKey);
          await loadFiles();
        } catch (err) {
          showToast(toast, "Error deleting", "error");
        }
      },
    },
  ];


  // --------------------------------------------------------
  const onDragDrop = (event: TreeDragDropEvent) => {
    setNodes(event.value);
    // ...
  };

  return (
    <>
      <Toast ref={toast} />
      <ContextMenu model={menuItems} ref={cm} />

      <aside className="group card w-full md:w-30rem">
        <section className="flex px-6 justify-between items-center bg-topbar-background text-topbar-foreground text-sm border-b border-border h-9 select-none">
          <AppMenu menuRef={menu} />
          <Button
            text
            onClick={(event) => menu.current.toggle(event)}
            className="rounded-none"
            aria-controls="app_menu"
            aria-haspopup
          >
            <i title="Menu" className="pi pi-bars hover:text-indigo-400"></i>
          </Button>

          <div className="group-hover:flex items-end gap-3 hidden">
            <i
              role="button"
              title="New file..."
              onClick={() => handleCreateClick(false)}
              className="pi pi-file-plus hover:text-indigo-400"
            ></i>

            <i
              role="button"
              title="New folder..."
              onClick={() => handleCreateClick(true)}
              className="pi pi-folder-plus hover:text-indigo-400"
            ></i>
          </div>
        </section>

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
          style={{height: "calc(100vh - 5rem)"}}
        />
      </aside>
    </>
  );
}
