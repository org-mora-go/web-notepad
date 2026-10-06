"use client";

import { Check, Layers, Pencil, Plus, Trash2, X } from "lucide-react";
import { type FormEvent, useState } from "react";

import type { GroupEntry } from "@/src/entity/notepad";
import { UNGROUPED_GROUP_ID } from "@/src/entity/notepad";
import { SearchField } from "@/src/feature";
import { matchesSearchQuery } from "@/src/feature/search-field/util";

import { GroupDeletePopup } from "./component";

const groupNameCollator = new Intl.Collator("ko", { sensitivity: "base" });
const koreanInitial = /^[\u1100-\u11ff\u3130-\u318f\uac00-\ud7a3]/u;

type Props = {
  groups: GroupEntry[];
  activeGroupId: string;
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  onSelect: (groupId: string) => void;
  onRemove: (groupId: string) => void;
  onRename: (groupId: string, name: string) => void;
};

export function Group({
  groups,
  activeGroupId,
  open,
  onClose,
  onCreate,
  onSelect,
  onRemove,
  onRename,
}: Props) {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const groupToDelete = groups.find((group) => group.id === deletingGroupId);
  const filteredGroups = groups
    .filter((group) => matchesSearchQuery(searchQuery, group.name))
    .sort((first, second) => {
      const firstIsUngrouped = first.id === UNGROUPED_GROUP_ID;
      const secondIsUngrouped = second.id === UNGROUPED_GROUP_ID;
      if (firstIsUngrouped !== secondIsUngrouped) return firstIsUngrouped ? -1 : 1;
      const firstIsKorean = koreanInitial.test(first.name);
      const secondIsKorean = koreanInitial.test(second.name);
      if (firstIsKorean !== secondIsKorean) return firstIsKorean ? -1 : 1;
      return groupNameCollator.compare(first.name, second.name);
    });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = groupName.trim();
    if (!trimmedName) return;
    onCreate(trimmedName);
    setGroupName("");
  };

  const handleRename = (event: FormEvent<HTMLFormElement>, groupId: string) => {
    event.preventDefault();
    const trimmedName = editingName.trim();
    if (!trimmedName) return;
    onRename(groupId, trimmedName);
    setEditingGroupId(null);
  };

  return (
    <div className="group">
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
        <SearchField
          value={searchQuery}
          ariaLabel="그룹 검색"
          placeholder="Search groups"
          onChange={setSearchQuery}
        />
        <form className="group-create-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={groupName}
            onChange={(event) => setGroupName(event.target.value)}
            placeholder="Group name"
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
          ) : filteredGroups.length === 0 ? (
            <div className="search-empty-state">
              <p>검색 결과가 없습니다</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <article
                className={`group-item ${group.id === activeGroupId ? "is-active" : ""}`}
                key={group.id}
              >
                {editingGroupId === group.id ? (
                  <form className="group-edit-form" onSubmit={(event) => handleRename(event, group.id)}>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      aria-label={`${group.name} 그룹 이름 수정`}
                      maxLength={60}
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.preventDefault();
                          setEditingGroupId(null);
                        }
                      }}
                    />
                    <button type="submit" aria-label="그룹 수정 저장" title="저장" disabled={!editingName.trim()}>
                      <Check size={14} />
                    </button>
                    <button type="button" aria-label="그룹 수정 취소" title="취소" onClick={() => setEditingGroupId(null)}>
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <>
                    <button
                      className="group-select"
                      type="button"
                      aria-pressed={group.id === activeGroupId}
                      onClick={() => onSelect(group.id)}
                    >
                      <strong>{group.name}</strong>
                    </button>
                    {group.id !== UNGROUPED_GROUP_ID && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGroupId(group.id);
                            setEditingName(group.name);
                          }}
                          aria-label={`${group.name} 그룹 수정`}
                          title="그룹 수정"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingGroupId(group.id)}
                          aria-label={`${group.name} 그룹 삭제`}
                          title="그룹 삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </>
                )}
              </article>
            ))
          )}
        </div>
      </aside>
      {open && groupToDelete && (
        <GroupDeletePopup
          groupName={groupToDelete.name}
          onCancel={() => setDeletingGroupId(null)}
          onConfirm={() => {
            onRemove(groupToDelete.id);
            setDeletingGroupId(null);
          }}
        />
      )}
    </div>
  );
}
