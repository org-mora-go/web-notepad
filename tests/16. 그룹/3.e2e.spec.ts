import { expect, test } from "@playwright/test";

test("3. 그룹별 탭, 북마크, 활성 패널 및 분할 비율을 관리한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("ungrouped note");

  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await page.getByRole("button", { name: "그룹 닫기" }).click();

  await page.locator("textarea").fill("work note");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();
  await page.locator('button[aria-label="새 탭 추가"]').click();
  await page.locator("textarea").fill("work right note");
  await page.locator("textarea").press("Alt+F12");
  await expect(page.locator(".body")).toHaveCount(2);

  const divider = page.getByRole("separator", { name: "영역 크기 조절" });
  const box = await divider.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + 120, box!.y + box!.height / 2);
  await page.mouse.up();

  const readGroups = () =>
    page.evaluate(() =>
      JSON.parse(localStorage.getItem("web-notepad-storage")!).state.groups.map(
        (group: {
          name: string;
          tabs: { content: string }[];
          bookmarks: { content: string }[];
          activePane: string;
          splitRatio: number;
        }) => ({
          name: group.name,
          tabs: group.tabs.map((tab) => tab.content),
          bookmarks: group.bookmarks.map((bookmark) => bookmark.content),
          activePane: group.activePane,
          splitRatio: group.splitRatio,
        }),
      ),
    );

  await expect
    .poll(async () => (await readGroups()).find((group: { name: string }) => group.name === "Work"))
    .toMatchObject({
      tabs: ["work note", "work right note"],
      bookmarks: ["work note"],
      activePane: "right",
    });
  const workRatio = (await readGroups()).find((group: { name: string }) => group.name === "Work").splitRatio;
  expect(workRatio).toBeGreaterThan(0.5);

  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.locator(".group-item").getByRole("button", { name: "Ungrouped", exact: true }).click();
  await expect(page.locator(".body")).toHaveCount(1);
  await expect(page.locator("textarea")).toHaveValue("ungrouped note");
  const ungrouped = (await readGroups()).find((group: { name: string }) => group.name === "Ungrouped");
  expect(ungrouped).toMatchObject({
    tabs: ["ungrouped note"],
    bookmarks: [],
    activePane: "left",
    splitRatio: 0.5,
  });

  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.locator(".group-item").getByRole("button", { name: "Work", exact: true }).click();
  await expect(page.locator(".body")).toHaveCount(2);
  await expect(page.locator(".pane-slot").first().locator("textarea")).toHaveValue("work note");
  await expect(page.locator(".pane-slot").nth(1).locator("textarea")).toHaveValue("work right note");
  expect((await readGroups()).find((group: { name: string }) => group.name === "Work").splitRatio).toBe(workRatio);
});
