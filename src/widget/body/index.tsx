"use client";

import type { RefObject } from "react";

import type { PaneDropZone } from "@/src/entity";
import type { NoteTab } from "@/src/entity/notepad";
import { NoteEditor } from "@/src/feature";

import { usePaneDropArea } from "./hook";

type Props = {
  activeTab: NoteTab;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  autoFocus?: boolean;
  draggingTabId: string | null;
  dropZones: PaneDropZone[];
  onChange: (content: string) => void;
};

export function Body({
  activeTab,
  editorRef,
  composingRef,
  autoFocus,
  draggingTabId,
  dropZones,
  onChange,
}: Props) {
  const dragActive = draggingTabId !== null;
  const adoptZone = dropZones.find((zone) => zone.key === "adopt");
  const dropArea = usePaneDropArea(dragActive, () => adoptZone?.onDrop());

  return (
    <div
      className="body"
      onDragEnter={dropArea.handleDragEnter}
      onDragLeave={dropArea.handleDragLeave}
      onDragOver={dropArea.handleDragOver}
      onDrop={dropArea.handleDrop}
    >
      <NoteEditor
        tab={activeTab}
        lineCount={activeTab.content.split("\n").length}
        editorRef={editorRef}
        composingRef={composingRef}
        autoFocus={autoFocus}
        onChange={onChange}
      />
      {dragActive && dropArea.dropAreaHovered &&
        dropZones.map((zone) => (
          <div
            key={zone.key}
            className={`note-pane-drop ${zone.half ? "is-half" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              zone.onDrop();
            }}
          >
            <span>{zone.label}</span>
          </div>
        ))}
    </div>
  );
}
