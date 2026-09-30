import type { RefObject } from "react";

import type { PaneDropZone } from "@/src/entity";
import type { TabStripState } from "@/src/entity/hook";
import type { NoteTab } from "@/src/entity/notepad";

export type PaneViewProps = {
  tabs: NoteTab[];
  activeTab: NoteTab;
  tabStrip: TabStripState;
  editorRef: RefObject<HTMLTextAreaElement | null>;
  composingRef: RefObject<boolean>;
  autoFocus?: boolean;
  isFocused: boolean;
  draggingTabId: string | null;
  dropZones: PaneDropZone[];
  widthRatio?: number;
  onResize?: (ratio: number) => void;
  onActivate: () => void;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
  onMove: (fromTabId: string, toTabId: string) => void;
  onAdopt: (tabId: string) => void;
  onDragStateChange: (tabId: string | null) => void;
  onToggleUrgent: (tabId: string) => void;
  onTogglePin: (tabId: string) => void;
  onToggleBookmark: (tabId: string) => void;
  onAdd: () => void;
  onChange: (content: string) => void;
};
