"use client";

import {
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
  useEffect,
  useId,
  useRef,
} from "react";

type Options = {
  onCancel: () => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>, close: (action: () => void) => void) => boolean;
};

// Modal confirm dialog: focuses Cancel, traps Tab focus, and cancels on Escape or backdrop click.
export function useConfirmDialog({ onCancel, onKeyDown }: Options) {
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

  const close = (action: () => void) => {
    dialogRef.current?.close();
    action();
  };

  const dialogProps = {
    ref: dialogRef,
    role: "alertdialog",
    "aria-modal": true,
    "aria-labelledby": `${popupId}-title`,
    "aria-describedby": `${popupId}-message`,
    onKeyDown: (event: KeyboardEvent<HTMLDialogElement>) => {
      event.stopPropagation();
      if (onKeyDown?.(event, close)) return;
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
    },
    onCancel: (event: SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      close(onCancel);
    },
    onClick: (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) close(onCancel);
    },
  };

  return { dialogProps, cancelButtonRef, popupId, close };
}
