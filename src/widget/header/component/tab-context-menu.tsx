"use client";

import { Bookmark, Pin } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  left: number;
  top: number;
  pinned: boolean;
  bookmarked: boolean;
  onTogglePin: () => void;
  onToggleBookmark: () => void;
  onClose: () => void;
};

export function TabContextMenu({
  left,
  top,
  pinned,
  bookmarked,
  onTogglePin,
  onToggleBookmark,
  onClose,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

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
      style={{ left, top }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <button type="button" role="menuitem" onClick={onTogglePin}>
        <Pin size={14} />
        <span>{pinned ? "Unpin" : "Pin"}</span>
      </button>
      <button type="button" role="menuitem" onClick={onToggleBookmark}>
        <Bookmark size={14} />
        <span>{bookmarked ? "Remove bookmark" : "Bookmark"}</span>
      </button>
    </div>
  );
}
