import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "./__util__";

test("7. 원본 탭이 없으면 내용과 탭 색상 및 선택한 줄을 복원한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(page, "restored bookmark\nsecond\nthird");
  const colorButton = page.locator(".tab-item.is-active .dirty-dot");
  await colorButton.click();
  await colorButton.click();
  const lines = page.locator('.line-rail [role="button"]');
  await lines.nth(1).click();
  await lines.nth(2).click();
  await page.locator(".tab-item.is-active .tab-close").click();

  await expect(page.locator("textarea")).toHaveValue("");
  await page.reload();
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await page.getByRole("button", { name: "열기" }).click();

  await expect(page.locator("textarea")).toHaveValue("restored bookmark\nsecond\nthird");
  await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", "red");
  await expect(lines.first()).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveCSS("background-color", "rgba(242, 139, 130, 0.2)");
});

for (const scenario of [
  { name: "색상·선택 정보 없음", tabColor: undefined, selectedLines: undefined, color: "green", selected: [] },
  { name: "이전 블루와 잘못된 선택값", tabColor: "blue", selectedLines: [2, 1, 1, -1, 3, 0.5, "0"], color: "red", selected: [1, 2] },
  { name: "그레이와 첫 줄 선택", tabColor: "gray", selectedLines: [0], color: "gray", selected: [0] },
]) {
  test(`7. 기존 북마크 복원 시 ${scenario.name}을 정규화한다`, async ({ page }) => {
    await page.addInitScript(({ tabColor, selectedLines }) => {
      localStorage.setItem("web-notepad-storage", JSON.stringify({
        state: {
          activeGroupId: "ungrouped",
          groups: [{
            id: "ungrouped",
            name: "Ungrouped",
            tabs: [{ id: "tab-1", content: "" }],
            bookmarks: [{
              id: "old-bookmark",
              sourceTabId: "closed-note",
              title: "Old bookmark",
              content: "one\ntwo\nthree",
              tabColor,
              selectedLines,
              createdAt: 1,
            }],
          }],
        },
        version: 0,
      }));
    }, { tabColor: scenario.tabColor, selectedLines: scenario.selectedLines });
    await page.goto("http://localhost:3000");
    await page.locator('button[aria-controls="bookmarks-panel"]').click();
    await page.getByRole("button", { name: "열기" }).click();
    await expect(page.locator("textarea")).toHaveValue("one\ntwo\nthree");
    await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", scenario.color);
    const lines = page.locator('.line-rail [role="button"]');
    for (let index = 0; index < 3; index += 1) {
      await expect(lines.nth(index)).toHaveAttribute("aria-pressed", String(scenario.selected.some((line) => line === index)));
    }
  });
}
