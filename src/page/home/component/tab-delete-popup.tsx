import { ConfirmPopup, isAltBackspace } from "@/src/entity";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function TabDeletePopup({ onConfirm, onCancel }: Props) {
  return (
    <ConfirmPopup
      title="Delete tab"
      message="Do you want to close this tab?"
      closeLabel="Close deletion confirmation"
      closeTitle="Close"
      onConfirm={onConfirm}
      onCancel={onCancel}
      onKeyDown={(event, close) => {
        if (!isAltBackspace(event)) return false;
        event.preventDefault();
        if (!event.repeat) close(onConfirm);
        return true;
      }}
    />
  );
}
