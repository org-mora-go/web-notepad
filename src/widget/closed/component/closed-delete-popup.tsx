import { AlertTriangle, Trash2, X } from "lucide-react";

import { useConfirmDialog } from "@/src/entity";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function ClosedDeletePopup({ onConfirm, onCancel }: Props) {
  const { dialogProps, cancelButtonRef, popupId, close } = useConfirmDialog({ onCancel });

  return (
    <dialog className="closed-delete-popup" {...dialogProps}>
      <div className="closed-delete-popup-content">
        <div className="closed-delete-popup-header">
          <div className="closed-delete-popup-title">
            <AlertTriangle size={18} aria-hidden="true" />
            <h3 id={`${popupId}-title`}>Delete closed tab</h3>
          </div>
          <button
            className="closed-delete-popup-close"
            type="button"
            aria-label="삭제 확인 닫기"
            title="닫기"
            onClick={() => close(onCancel)}
          >
            <X size={16} />
          </button>
        </div>
        <p id={`${popupId}-message`}>
          This closed tab will be permanently deleted and cannot be restored. Do you want to delete it?
        </p>
        <div className="closed-delete-popup-actions">
          <button ref={cancelButtonRef} type="button" onClick={() => close(onCancel)}>
            <X size={14} aria-hidden="true" />
            Cancel
          </button>
          <button className="closed-delete-popup-confirm" type="button" onClick={() => close(onConfirm)}>
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}
