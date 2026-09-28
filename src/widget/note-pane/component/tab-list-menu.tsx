import { Menu, X } from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { NoteTab } from "@/src/page/home/store";

type Props = {
  tabs: NoteTab[];
  activeTabId: string;
  tabListRef: RefObject<HTMLDivElement | null>;
  tabsOverflowing: boolean;
  tabListOpen: boolean;
  setTabListOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (tabId: string) => void;
  onClose: (tabId: string) => void;
};

export function TabListMenu({
  tabs,
  activeTabId,
  tabListRef,
  tabsOverflowing,
  tabListOpen,
  setTabListOpen,
  onSelect,
  onClose,
}: Props) {
  if (!tabsOverflowing) return null;

  return (
    <div className="tab-list-menu" ref={tabListRef}>
      <button
        className={`tab-list-toggle ${tabListOpen ? "is-active" : ""}`}
        type="button"
        onClick={() => setTabListOpen((open) => !open)}
        aria-label="탭 목록"
        aria-expanded={tabListOpen}
        aria-controls="tab-list-menu"
        title="탭 목록"
      >
        <Menu size={16} />
      </button>
      {tabListOpen && (
        <ul id="tab-list-menu" className="tab-list-menu" role="menu">
          {tabs.map((tab) => (
            <li key={tab.id} role="none" className={tab.id === activeTabId ? "is-active" : ""}>
              <button
                type="button"
                role="menuitem"
                className="tab-list-select"
                onClick={() => {
                  onSelect(tab.id);
                  setTabListOpen(false);
                }}
              >
                {tab.title}
              </button>
              <button
                type="button"
                className="tab-list-close"
                onClick={() => onClose(tab.id)}
                aria-label={`${tab.title} 닫기`}
                title="탭 닫기"
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
