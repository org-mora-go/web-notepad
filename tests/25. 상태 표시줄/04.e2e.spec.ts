import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";

test("4. PC는 좌우 명령 묶음으로, 모바일은 네 메뉴를 균등 배치한다", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".status-light, .save-state")).toHaveCount(0);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const commands = page.locator(".status-meta .status-command:visible");
    const labels = viewport.width <= 640
      ? ["SEARCH", "CLOSED", "BOOKMARK", "GROUP"]
      : ["SHORTCUT", "SEARCH", "CLOSED", "BOOKMARK", "Ungrouped"];
    await expect(commands).toHaveCount(labels.length);
    for (const [index, command] of (await commands.all()).entries()) {
      await expect(command).toContainText(labels[index]);
      if (viewport.width <= 640) {
        const bounds = (await command.boundingBox())!;
        expect(bounds.width).toBeCloseTo(viewport.width / labels.length, 1);
        expect(bounds.x).toBeCloseTo(index * viewport.width / labels.length, 1);
      }
    }
    if (viewport.width > 640) {
      const boxes = await Promise.all((await commands.all()).map((command) => command.boundingBox()));
      expect(boxes[0]!.x).toBe(16);
      expect(boxes[1]!.x - boxes[0]!.x - boxes[0]!.width).toBeCloseTo(20, 1);
      expect(boxes[2]!.x - boxes[1]!.x - boxes[1]!.width).toBeGreaterThan(20);
      expect(boxes[3]!.x - boxes[2]!.x - boxes[2]!.width).toBeCloseTo(20, 1);
      expect(boxes[4]!.x - boxes[3]!.x - boxes[3]!.width).toBeCloseTo(20, 1);
      expect(boxes[4]!.x + boxes[4]!.width).toBeCloseTo(viewport.width - 16, 1);
    }
  }
});
