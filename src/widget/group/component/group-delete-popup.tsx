import { AlertTriangle, Trash2, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

type Props = {
  groupName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function GroupDeletePopup({ groupName, onConfirm, onCancel }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const popupId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    cancelButtonRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const closePopup = (action: () => void) => {
    dialogRef.current?.close();
    action();
  };

  return (
    <dialog
      ref={dialogRef}
      className="group-delete-popup"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={`${popupId}-title`}
      aria-describedby={`${popupId}-message`}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key !== "Tab") return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
        const firstButton = buttons[0];
        const lastButton = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === firstButton) {
          event.preventDefault();
          lastButton.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          firstButton.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        closePopup(onCancel);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closePopup(onCancel);
      }}
    >
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
            onClick={() => closePopup(onCancel)}
          >
            <X size={16} />
          </button>
        </div>
        <p id={`${popupId}-message`}>Do you want to delete {groupName}?</p>
        <div className="group-delete-popup-actions">
          <button ref={cancelButtonRef} type="button" onClick={() => closePopup(onCancel)}>
            <X size={14} aria-hidden="true" />
            Cancel
          </button>
          <button className="group-delete-popup-confirm" type="button" onClick={() => closePopup(onConfirm)}>
            <Trash2 size={14} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}