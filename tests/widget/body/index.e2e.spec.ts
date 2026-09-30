import { expect, test } from "@playwright/test";

test("split body는 두 에디터를 표시하고 divider로 너비를 조절한다", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const tabs = [
      {
        id: "tab-1",
        title: "Left note",
        content: "left body content",
        savedContent: "left body content",
        urgent: false,
        pinned: false,
        bookmarked: false,
        updatedAt: 1,
      },
      {
        id: "tab-2",
        title: "Right note",
        content: "right body content",
        savedContent: "right body content",
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
          nextTabNumber: 3,
          groups: [
            {
              id: "ungrouped",
              name: "Ungrouped",
              createdAt: 0,
              tabs,
              bookmarks: [],
              activeTabId: "tab-1",
              rightTabIds: ["tab-2"],
              activeRightTabId: "tab-2",
              activePane: "left",
              splitRatio: 0.5,
            },
          ],
        },
        version: 0,
      }),
    );
  });
  await page.goto("http://localhost:3000");

  const bodies = page.locator(".note-pane-body");
  await expect(bodies).toHaveCount(2);
  await expect(bodies.nth(0).locator("textarea")).toHaveValue(
    "left body content",
  );
  await expect(bodies.nth(1).locator("textarea")).toHaveValue(
    "right body content",
  );

  const divider = page.getByRole("separator", { name: "영역 크기 조절" });
  await expect(divider).toBeVisible();
  const leftPane = page.locator(".pane-slot").first();
  const initialBox = await leftPane.boundingBox();
  const dividerBox = await divider.boundingBox();
  expect(initialBox).not.toBeNull();
  expect(dividerBox).not.toBeNull();

  await page.mouse.move(
    dividerBox!.x + dividerBox!.width / 2,
    dividerBox!.y + dividerBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    dividerBox!.x + dividerBox!.width / 2 + 80,
    dividerBox!.y + dividerBox!.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();

  await expect
    .poll(async () => (await leftPane.boundingBox())?.width ?? 0)
    .toBeGreaterThan(initialBox!.width + 40);
  await expect(bodies.nth(1).locator("textarea")).toHaveValue(
    "right body content",
  );
});
