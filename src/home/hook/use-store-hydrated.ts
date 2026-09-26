"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useNotepadStore } from "@/src/home/store";

const subscribeToHydration = (onStoreChange: () => void) =>
  useNotepadStore.persist?.onFinishHydration(onStoreChange) ?? (() => undefined);

const getHydrationSnapshot = () => useNotepadStore.persist?.hasHydrated() ?? false;

export function useStoreHydrated() {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    () => false,
  );

  useEffect(() => {
    void useNotepadStore.persist?.rehydrate();
  }, []);

  return hydrated;
}
