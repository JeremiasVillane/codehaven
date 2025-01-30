import { Header } from "@/components/Layout/header";
import { FileExplorer, FileExplorerHeader } from "@/components/Layout/left-panel";
import { CodeEditor, CodeEditorHeader, Terminal } from "@/components/Layout/middle-panel";
import { panels } from "@/components/Layout/panels";
import { Preview } from "@/components/Layout/right-panel";
import PreviewHeader from "@/components/Layout/right-panel/preview-header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SortableItem } from "@/components/ui/sortable-item";
import { PanelData } from "@/types";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import React, { useState } from "react";

export default function IndexPage() {
  const [currentPanels, setCurrentPanels] = useState<PanelData[]>(panels);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setCurrentPanels((prevPanels) => {
        const oldIndex = prevPanels.findIndex((p) => p.id === active.id);
        const newIndex = prevPanels.findIndex((p) => p.id === over.id);
        return arrayMove(prevPanels, oldIndex, newIndex);
      });
    }
  };

  const panelGroupKey = currentPanels.map((panel) => panel.id).join("-");

  return (
    <main className="h-screen w-screen">
      <Header />

      <section className="size-screen bg-background">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentPanels.map((p) => p.id)}
            strategy={horizontalListSortingStrategy}
          >
            <ResizablePanelGroup
              key={panelGroupKey}
              direction="horizontal"
              className="flex size-full"
            >
              {currentPanels.map((panel, index) => (
                <React.Fragment key={panel.id}>
                  <ResizablePanel
                    defaultSize={panel.defaultSize}
                    minSize={panel.minSize}
                    maxSize={panel.maxSize}
                    className="group"
                  >
                    <SortableItem id={panel.id} header={panel.header}>
                      {panel.subPanels ? (
                        <ResizablePanelGroup direction="vertical">
                          {panel.subPanels.map((subPanel, subIndex) => (
                            <React.Fragment key={subPanel.id}>
                              <ResizablePanel
                                defaultSize={subPanel.defaultSize}
                                minSize={subPanel.minSize}
                                maxSize={subPanel.maxSize}
                              >
                                {subPanel.content}
                              </ResizablePanel>
                              {subIndex < panel.subPanels!.length - 1 && (
                                <ResizableHandle />
                              )}
                            </React.Fragment>
                          ))}
                        </ResizablePanelGroup>
                      ) : (
                        panel.content
                      )}
                    </SortableItem>
                  </ResizablePanel>
                  {index < currentPanels.length - 1 && (
                    <ResizableHandle />
                  )}
                </React.Fragment>
              ))}
            </ResizablePanelGroup>
          </SortableContext>
        </DndContext>
      </section>

      {/* <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={12} maxSize={33}>
          <FileExplorerHeader />
          <FileExplorer />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={12}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={79}>
              <CodeEditorHeader />
              <CodeEditor />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={21} minSize={3}>
              <Terminal />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40}>
          <PreviewHeader />
          <Preview />
        </ResizablePanel>
      </ResizablePanelGroup> */}
    </main>
  );
}
