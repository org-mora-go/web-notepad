"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import type { KeyboardEvent } from "react";

import { useConfirmDialog } from "../../hook";

type Props = {
  title: string;
  message: string;
  closeLabel: string;
  closeTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>, close: (action: () => void) => void) => boolean;
};

// Delete confirmation dialog with Cancel focused first and a destructive Delete action.
export function ConfirmPopup({
  title,
  message,
  closeLabel,
  closeTitle,
  onConfirm,
  onCancel,
  onKeyDown,
}: Props) {
  const { dialogProps, cancelButtonRef, popupId, close } = useConfirmDialog({ onCancel, onKeyDown });

  return (
    <dialog className="confirm-popup" {...dialogProps}>
      <div className="confirm-popup-content">
        <div className="confirm-popup-header">
          <div className="confirm-popup-title">
            <AlertTriangle size={18} aria-hidden="true" />
            <h3 id={`${popupId}-title`}>{title}</h3>
          </div>
          <button
            className="confirm-popup-close"
            type="button"
            aria-label={closeLabel}
            title={closeTitle}
            onClick={() => close(onCancel)}
          >
            <X size={16} />
          </button>
        </div>
        <p id={`${popupId}-message`}>{message}</p>
        <div className="confirm-popup-actions">
          <button ref={cancelButtonRef} type="button" onClick={() => close(onCancel)}>
            <X size={14} aria-hidden="true" />
            Cancel
          </button>
          <button className="confirm-popup-confirm" type="button" onClick={() => close(onConfirm)}>
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}
