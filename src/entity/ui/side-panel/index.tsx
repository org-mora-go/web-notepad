"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  // Module class added next to `side-panel` so each widget can style its own panel.
  className: string;
  id: string;
  title: string;
  open: boolean;
  closeLabel: string;
  ariaLabel?: string;
  onClose: () => void;
  children: ReactNode;
};

// Right drawer shell: backdrop, sliding aside and a header with a close button.
export function SidePanel({
  className,
  id,
  title,
  open,
  closeLabel,
  ariaLabel,
  onClose,
  children,
}: Props) {
  return (
    <div className={`side-panel ${className}`}>
      <div
        className={`side-panel-backdrop ${open ? "is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id={id}
        className={`side-panel-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label={ariaLabel}
      >
        <div className="side-panel-header">
          <h2>{title}</h2>
          <button
            className="side-panel-close"
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}
