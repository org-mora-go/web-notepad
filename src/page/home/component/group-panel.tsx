"use client";

import { Layers, Plus, Trash2, X } from "lucide-react";
import { type FormEvent, useState } from "react";

import type { GroupEntry } from "@/src/entity/notepad";
import { UNGROUPED_GROUP_ID } from "@/src/entity/notepad";

type Props = {
  groups: GroupEntry[];
  activeGroupId: string;
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  onSelect: (groupId: string) => void;
  onRemove: (groupId: string) => void;
};

export function GroupPanel({
  groups,
  activeGroupId,
  open,
  onClose,
  onCreate,
  onSelect,
  onRemove,
}: Props) {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = groupName.trim();
    if (!trimmedName) return;
    onCreate(trimmedName);
    setGroupName("");
  };

  return (
    <div className="group-panel">
      <div
        className={`group-backdrop ${open ? "is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="groups-panel"
        className={`group-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="group-header">
          <h2>Groups</h2>
          <button
            className="group-close"
            type="button"
            onClick={onClose}
            aria-label="그룹 닫기"
          >
            <X size={16} />
          </button>
        </div>
        <form className="group-create-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="그룹 이름"
            aria-label="새 그룹 이름"
            maxLength={60}
          />
          <button
            type="submit"
            aria-label="그룹 생성"
            disabled={!groupName.trim()}
          >
            <Plus size={16} />
          </button>
        </form>
        <div className="group-list">
          {groups.length === 0 ? (
            <div className="group-empty">
              <Layers size={24} strokeWidth={1.5} />
              <p>아직 그룹이 없습니다</p>
            </div>
          ) : (
            groups.map((group) => (
              <article
                className={`group-item ${group.id === activeGroupId ? "is-active" : ""}`}
                key={group.id}
              >
                <button
                  className="group-select"
                  type="button"
                  aria-pressed={group.id === activeGroupId}
                  onClick={() => onSelect(group.id)}
                >
                  <strong>{group.name}</strong>
                </button>
                {group.id !== UNGROUPED_GROUP_ID && (
                  <button
                    type="button"
                    onClick={() => onRemove(group.id)}
                    aria-label={`${group.name} 그룹 삭제`}
                    title="그룹 삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </article>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
