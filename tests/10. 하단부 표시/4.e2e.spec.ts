import { expect, test } from "@playwright/test";

test("4. 상태 표시줄 항목을 외곽선 없이 구분하고 정보를 우측 정렬한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  const shortcut = page.locator(".shortcut-command");
  const lines = page.locator(".status-lines");
  const bookmark = page.locator(".status-actions .status-command").first();
  const group = page.locator(".status-actions .status-command").nth(1);
  const separators = page.locator(".status-separator");
  const expectMetaRightAligned = async () => {
    const alignment = await page.locator(".status-meta").evaluate((meta) => {
      const statusBar = meta.closest(".status-bar");
      const group = meta.querySelector(".group-status-command");
      if (!statusBar || !group) return null;

      const barBounds = statusBar.getBoundingClientRect();
      const groupBounds = group.getBoundingClientRect();
      const paddingRight = parseFloat(getComputedStyle(statusBar).paddingRight);
      return {
        groupRight: groupBounds.right,
        contentRight: barBounds.right - paddingRight,
      };
    });

    expect(alignment).not.toBeNull();
    expect(
      Math.abs(alignment!.groupRight - alignment!.contentRight),
    ).toBeLessThan(1);
  };

  await expect(separators).toHaveCount(3);
  await expect(separators).toHaveText(["|", "|", "|"]);
  await expect(shortcut.locator(".status-separator")).toHaveCount(1);
  await expect(lines.locator(".status-separator")).toHaveCount(0);
  await expect(bookmark.locator(".status-separator")).toHaveCount(1);
  await expect(group.locator(".status-separator")).toHaveCount(1);
  await expect(shortcut).toHaveCSS("border-top-width", "0px");
  await expect(bookmark).toHaveCSS("border-top-width", "0px");
  await expect(group).toHaveCSS("border-top-width", "0px");
  await expect(page.getByRole("button", { name: "BOOKMARK" })).toBeVisible();
  await expectMetaRightAligned();

  await page.setViewportSize({ width: 390, height: 844 });
  await expectMetaRightAligned();
});
