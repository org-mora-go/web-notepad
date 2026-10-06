import { expect, test } from "@playwright/test";

test("4. 저장된 블루 색상은 레드로 변환하고 유효한 탭 색상은 유지한다", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("web-notepad-storage", JSON.stringify({
      state: {
        activeGroupId: "ungrouped",
        groups: [{
          id: "ungrouped",
          name: "Ungrouped",
          activeTabId: "tab-1",
          tabs: ["blue", "red", "green", "gray"].map((tabColor, index) => ({
            id: `tab-${index + 1}`,
            content: "",
            tabColor,
          })),
        }],
      },
      version: 0,
    }));
  });
  await page.goto("http://localhost:3000");
  const tabs = page.locator(".tab-item");
  await expect(tabs).toHaveCount(4);
  for (const [index, color] of ["red", "red", "green", "gray"].entries()) {
    await expect(tabs.nth(index)).toHaveAttribute("data-tab-color", color);
  }
  await tabs.first().locator(".dirty-dot").click();
  await expect(tabs.first()).toHaveAttribute("data-tab-color", "gray");
});