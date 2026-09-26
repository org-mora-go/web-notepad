"use client";

import { useEffect, useRef, useState } from "react";

export function useTabStrip(tabCount: number, activeTabId: string, hydrated: boolean) {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const [tabsOverflowing, setTabsOverflowing] = useState(false);
  const [tabListOpen, setTabListOpen] = useState(false);

  useEffect(() => {
    const scroller = tabsScrollRef.current;
    if (!scroller) return;

    const update = () => {
      const overflowing = scroller.scrollWidth > scroller.clientWidth;
      setTabsOverflowing(overflowing);
      if (!overflowing) setTabListOpen(false);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [tabCount, hydrated]);

  useEffect(() => {
    tabsScrollRef.current
      ?.querySelector(".tab-item.is-active")
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeTabId, hydrated]);

  useEffect(() => {
    if (!tabListOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!tabListRef.current?.contains(event.target as Node)) setTabListOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTabListOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tabListOpen]);

  return { tabsScrollRef, tabListRef, tabsOverflowing, tabListOpen, setTabListOpen };
}
