"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const shortcuts = [
  { action: "새 탭 추가", keys: ["Alt + Tab"] },
  { action: "활성 탭 닫기", keys: ["Alt + Backspace"] },
  { action: "탭 간 이동", keys: ["Alt + Arrow Up", "Alt + Arrow Down"] },
  { action: "내용 전체 선택", keys: ["Cmd + A", "Alt + A"] },
  { action: "오른쪽 패널로 이동", keys: ["Option + F12"] },
  { action: "왼쪽 패널로 이동", keys: ["Option + F11"] },
  { action: "탭 문자 삽입", keys: ["Tab"] },
];

export function ShortcutHelp({ open, onClose }: Props) {
  return (
    <div className="shortcut-panel">
      <div
        className={`shortcut-backdrop ${open ? "is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="shortcuts-panel"
        className={`shortcut-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label="키보드 단축키"
      >
        <div className="shortcut-header">
          <h2>Keyboard Shortcuts</h2>
          <button
            className="shortcut-close"
            type="button"
            onClick={onClose}
            aria-label="단축키 닫기"
          >
            <X size={16} />
          </button>
        </div>
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
      </aside>
    </div>
  );
}
