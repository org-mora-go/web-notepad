import { expect, type Page, test } from "@playwright/test";

async function seedSplitState(page: Page) {
  await page.addInitScript(() => {
    const tabs = [
      {
        id: "left",
        title: "Left",
        content: "left",
        savedContent: "left",
        urgent: false,
        pinned: false,
        bookmarked: false,
        updatedAt: 1,
      },
      {
        id: "right",
        title: "Right",
        content: "right",
        savedContent: "right",
        urgent: false,
        pinned: false,
        bookmarked: false,
        updatedAt: 2,
      },
    ];
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({
        state: {
          activeGroupId: "ungrouped",
          groups: [
            {
              id: "ungrouped",
              name: "Ungrouped",
              createdAt: 0,
              tabs,
              bookmarks: [],
              activeTabId: "left",
              rightTabIds: ["right"],
              activeRightTabId: "right",
              activePane: "left",
              splitRatio: 0.5,
            },
          ],
        },
        version: 0,
      }),
    );
  });
}

test("b. 구분선을 드래그하면 패널 너비 비율이 변경된다", async ({ page }) => {
  await seedSplitState(page);
  await page.goto("http://localhost:3000");
  const divider = page.getByRole("separator", { name: "영역 크기 조절" });
  const box = await divider.boundingBox();
  const left = page.locator(".pane-slot").first();
  const initial = await left.boundingBox();
  expect(box).not.toBeNull();
  expect(initial).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box!.x + box!.width / 2 + 70,
    box!.y + box!.height / 2,
    { steps: 3 },
  );
  await page.mouse.up();
  await expect
    .poll(async () => (await left.boundingBox())?.width ?? 0)
    .toBeGreaterThan(initial!.width + 30);
});
