"use client";

import { useEffect, useRef, useState } from "react";

export function useTabStrip(
  tabCount: number,
  activeTabId: string,
  hydrated: boolean,
) {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [tabsOverflowing, setTabsOverflowing] = useState(false);
  const [tabsCanScrollLeft, setTabsCanScrollLeft] = useState(false);
  const [tabsCanScrollRight, setTabsCanScrollRight] = useState(false);

  useEffect(() => {
    const scroller = tabsScrollRef.current;
    if (!scroller) return;

    const update = () => {
      const overflowing = scroller.scrollWidth > scroller.clientWidth;
      setTabsOverflowing(overflowing);
      setTabsCanScrollLeft(overflowing && scroller.scrollLeft > 0);
      setTabsCanScrollRight(
        overflowing &&
          scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
      );
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [tabCount, hydrated]);

  useEffect(() => {
    tabsScrollRef.current
      ?.querySelector(".tab-item.is-active")
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeTabId, hydrated]);

  return {
    tabsScrollRef,
    tabsOverflowing,
    tabsCanScrollLeft,
    tabsCanScrollRight,
  };
}

export type TabStripState = ReturnType<typeof useTabStrip>;
