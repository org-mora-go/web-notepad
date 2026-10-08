import { AlertTriangle, Trash2, X } from "lucide-react";

import { useConfirmDialog } from "@/src/entity";

type Props = {
  groupName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function GroupDeletePopup({ groupName, onConfirm, onCancel }: Props) {
  const { dialogProps, cancelButtonRef, popupId, close } = useConfirmDialog({ onCancel });

  return (
    <dialog className="group-delete-popup" {...dialogProps}>
      <div className="group-delete-popup-content">
        <div className="group-delete-popup-header">
          <div className="group-delete-popup-title">
            <AlertTriangle size={18} aria-hidden="true" />
            <h3 id={`${popupId}-title`}>Delete group</h3>
          </div>
          <button
            className="group-delete-popup-close"
            type="button"
            aria-label="삭제 확인 닫기"
            title="닫기"
            onClick={() => close(onCancel)}
          >
            <X size={16} />
          </button>
        </div>
        <p id={`${popupId}-message`}>Do you want to delete {groupName}?</p>
        <div className="group-delete-popup-actions">
          <button ref={cancelButtonRef} type="button" onClick={() => close(onCancel)}>
            <X size={14} aria-hidden="true" />
            Cancel
          </button>
          <button className="group-delete-popup-confirm" type="button" onClick={() => close(onConfirm)}>
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}
