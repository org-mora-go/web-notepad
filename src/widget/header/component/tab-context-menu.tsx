"use client";

import { ArrowLeft, ArrowRight, Bookmark, FolderInput, Pin } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { GroupEntry } from "@/src/entity/notepad";

type Props = {
  left: number;
  top: number;
  pinned: boolean;
  bookmarked: boolean;
  targetGroups: GroupEntry[];
  onMoveToGroup: (groupId: string) => void;
  onTogglePin: () => void;
  onToggleBookmark: () => void;
  onClose: () => void;
};

export function TabContextMenu({
  left,
  top,
  pinned,
  bookmarked,
  targetGroups,
  onMoveToGroup,
  onTogglePin,
  onToggleBookmark,
  onClose,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [choosingGroup, setChoosingGroup] = useState(false);

  useLayoutEffect(() => {
    const positionMenu = () => {
      const menu = menuRef.current;
      if (!menu) return;
      menu.style.left = `${Math.max(8, Math.min(left, window.innerWidth - menu.offsetWidth - 8))}px`;
      menu.style.top = `${Math.max(8, Math.min(top, window.innerHeight - menu.offsetHeight - 8))}px`;
    };
    positionMenu();
    window.addEventListener("resize", positionMenu);
    return () => window.removeEventListener("resize", positionMenu);
  }, [left, top, choosingGroup, targetGroups.length]);

  useEffect(() => {
    if (choosingGroup) menuRef.current?.querySelector<HTMLButtonElement>(".move-group-option")?.focus();
  }, [choosingGroup]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="tab-context-menu"
      role="menu"
      aria-label={choosingGroup ? "Move Group" : "Tab actions"}
      style={{ left, top }}
      onContextMenu={(event) => event.preventDefault()}
    >
      {choosingGroup ? (
        <>
          <button type="button" role="menuitem" aria-label="Back to tab actions" onClick={() => setChoosingGroup(false)}>
            <ArrowLeft size={14} />
            <span>Move Group</span>
          </button>
          <div className="move-group-options">
            {targetGroups.map((group) => (
              <button className="move-group-option" key={group.id} type="button" role="menuitem" title={group.name} onClick={() => onMoveToGroup(group.id)}>
                <span>{group.name}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button type="button" role="menuitem" onClick={onTogglePin}>
            <Pin size={14} />
            <span>{pinned ? "Unpin" : "Pin"}</span>
          </button>
          <button type="button" role="menuitem" onClick={onToggleBookmark}>
            <Bookmark size={14} />
            <span>{bookmarked ? "Remove bookmark" : "Bookmark"}</span>
          </button>
          <button type="button" role="menuitem" disabled={targetGroups.length === 0} onClick={() => setChoosingGroup(true)}>
            <FolderInput size={14} />
            <span>Move Group</span>
            <ArrowRight size={14} className="move-group-arrow" />
          </button>
        </>
      )}
    </div>
  );
}
