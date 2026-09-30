"use client";

import { usePaneResize } from "../hook";

type Props = {
  onResize: (ratio: number) => void;
};

export function PaneDivider({ onResize }: Props) {
  const handlePointerDown = usePaneResize(onResize);

  return (
    <div
      className="pane-divider"
      role="separator"
      aria-orientation="vertical"
      aria-label="영역 크기 조절"
      onPointerDown={handlePointerDown}
    />
  );
}
