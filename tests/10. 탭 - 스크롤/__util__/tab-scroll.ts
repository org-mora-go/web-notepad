import type { Locator, Page } from "@playwright/test";

import { addTabButton } from "../../__util__";

// Adds enough tabs for the tab strip to overflow horizontally.
export async function overflowTabs(page: Page) {
  for (let index = 0; index < 11; index += 1) {
    await addTabButton(page).click();
  }
}

// Scrolls the tab scroller to its start, middle, or end and notifies listeners.
export async function scrollTabs(scroller: Locator, position: "start" | "middle" | "end") {
  await scroller.evaluate((element, target) => {
    const maxScroll = element.scrollWidth - element.clientWidth;
    element.scrollLeft = target === "start" ? 0 : target === "middle" ? maxScroll / 2 : element.scrollWidth;
    element.dispatchEvent(new Event("scroll"));
  }, position);
}
