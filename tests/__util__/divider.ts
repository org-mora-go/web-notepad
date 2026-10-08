import type { Page } from "@playwright/test";

export const divider = (page: Page) => page.getByRole("separator", { name: "영역 크기 조절" });

// Drags the split divider horizontally to the absolute x coordinate.
export async function dragDividerTo(page: Page, x: number) {
  const box = (await divider(page).boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
}

// Drags the split divider horizontally by `offset` pixels from its current center.
export async function dragDividerBy(page: Page, offset: number) {
  const box = (await divider(page).boundingBox())!;
  await dragDividerTo(page, box.x + box.width / 2 + offset);
}

// Horizontal distance between the divider center and the pane group center.
export async function dividerDistanceFromCenter(page: Page) {
  const paneBounds = await page.locator(".pane-group").boundingBox();
  const dividerBounds = await divider(page).boundingBox();
  if (!paneBounds || !dividerBounds) return Number.POSITIVE_INFINITY;
  const paneCenter = paneBounds.x + paneBounds.width / 2;
  const dividerCenter = dividerBounds.x + dividerBounds.width / 2;
  return Math.abs(dividerCenter - paneCenter);
}
