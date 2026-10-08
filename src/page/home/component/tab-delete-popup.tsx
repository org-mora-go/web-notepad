import { AlertTriangle, Trash2, X } from "lucide-react";

import { isAltBackspace, useConfirmDialog } from "@/src/entity";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function TabDeletePopup({ onConfirm, onCancel }: Props) {
  const { dialogProps, cancelButtonRef, popupId, close } = useConfirmDialog({
    onCancel,
    onKeyDown: (event, closeWith) => {
      if (!isAltBackspace(event)) return false;
      event.preventDefault();
      if (!event.repeat) closeWith(onConfirm);
      return true;
    },
  });

  return (
    <dialog className="tab-delete-popup" {...dialogProps}>
      <div className="tab-delete-popup-content">
        <div className="tab-delete-popup-header">
          <div className="tab-delete-popup-title">
            <AlertTriangle size={18} aria-hidden="true" />
            <h3 id={`${popupId}-title`}>Delete tab</h3>
          </div>
          <button
            className="tab-delete-popup-close"
            type="button"
            aria-label="Close deletion confirmation"
            title="Close"
            onClick={() => close(onCancel)}
          >
            <X size={16} />
          </button>
        </div>
        <p id={`${popupId}-message`}>Do you want to delete this tab?</p>
        <div className="tab-delete-popup-actions">
          <button ref={cancelButtonRef} type="button" onClick={() => close(onCancel)}>
            <X size={14} aria-hidden="true" />
            Cancel
          </button>
          <button className="tab-delete-popup-confirm" type="button" onClick={() => close(onConfirm)}>
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}
