"use client";

import { useEffect, useRef, useState } from "react";

export function useTabStrip(tabCount: number, activeTabId: string, hydrated: boolean) {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [tabsOverflowing, setTabsOverflowing] = useState(false);

  useEffect(() => {
    const scroller = tabsScrollRef.current;
    if (!scroller) return;

    const update = () => {
      const overflowing = scroller.scrollWidth > scroller.clientWidth;
      setTabsOverflowing(overflowing);
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

  return { tabsScrollRef, tabsOverflowing };
}

export type TabStripState = ReturnType<typeof useTabStrip>;
