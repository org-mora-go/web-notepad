"use client";

import { SidePanel } from "@/src/entity/ui";

type Props = {
  open: boolean;
  onClose: () => void;
};

const shortcuts = [
  { action: "새 탭 추가", keys: ["Option + Tab"] },
  { action: "활성 탭 닫기", keys: ["Option + Backspace"] },
  {
    action: "탭 간 이동",
    keys: ["Option + Arrow Up", "Option + Arrow Down"],
  },
  { action: "내용 전체 선택", keys: ["Cmd + A", "Option + A"] },
  { action: "오른쪽 패널로 이동", keys: ["Option + F12"] },
  { action: "왼쪽 패널로 이동", keys: ["Option + F11"] },
  { action: "탭 문자 삽입", keys: ["Tab"] },
  { action: "라인 범위 선택 및 해제", keys: ["Shift + 클릭"] },
];

export function Shortcut({ open, onClose }: Props) {
  return (
    <SidePanel
      className="shortcut"
      id="shortcuts-panel"
      title="Shortcut (mac)"
      open={open}
      closeLabel="단축키 닫기"
      ariaLabel="키보드 단축키"
      onClose={onClose}
    >
      <dl className="shortcut-list">
        {shortcuts.map(({ action, keys }) => (
          <div className="shortcut-row" key={action}>
            <dt>{action}</dt>
            <dd>
              {keys.map((key) => (
                <kbd key={key}>{key}</kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </SidePanel>
  );
}
