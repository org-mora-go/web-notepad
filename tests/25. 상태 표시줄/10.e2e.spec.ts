import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { createGroupFixture, createTabFixture } from "../__fixture__";
import { switchGroup, writeStoredState } from "../__util__";

test("10. 모바일 최상부 그룹 표시줄은 그룹 전환과 새로고침에 동기화된다", async ({ page }) => {
  const longName = "Very long group name for mobile current group layout";
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")]),
      createGroupFixture("work", longName, [createTabFixture("tab-2", "Work note")]),
    ],
    nextTabNumber: 3,
  });
  const panel = page.getByRole("status", { name: "현재 그룹", includeHidden: true });
  const name = panel.locator(".current-group-name");
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(panel).toBeHidden();

  await page.setViewportSize({ width: 320, height: 844 });
  await expect(panel).toBeVisible();
  await expect(name).toHaveText("Ungrouped");
  await expect(panel.locator("svg")).toBeVisible();
  await switchGroup(page, longName);
  await expect(name).toHaveText(longName);
  await expect(name).toHaveAttribute("title", longName);
  await expect(name).toHaveCSS("text-overflow", "ellipsis");
  await expect(name).toHaveCSS("white-space", "nowrap");
  expect(await name.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(panel).toBeInViewport();
    await expect(name).toHaveCSS("font-size", "15px");
    await expect(panel.locator("svg")).toHaveCSS("width", "18px");
    await expect(panel.locator("svg")).toHaveCSS("height", "18px");
    const panelBounds = (await panel.boundingBox())!;
    const footerBounds = (await page.locator(".status-bar").boundingBox())!;
    const editorBounds = (await page.locator(".pane-group").boundingBox())!;
    expect(panelBounds.height).toBe(44);
    expect(panelBounds.y).toBe(0);
    expect(panelBounds.y + panelBounds.height).toBe(editorBounds.y);
    expect(editorBounds.y + editorBounds.height).toBe(footerBounds.y);
    expect(await panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  }

  await page.reload();
  await expect(name).toHaveText(longName);
  await switchGroup(page, "Ungrouped");
  await expect(name).toHaveText("Ungrouped");
});