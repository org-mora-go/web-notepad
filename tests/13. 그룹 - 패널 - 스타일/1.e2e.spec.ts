import { expect, test } from "@playwright/test";

test("1. 그룹 이름을 PC와 모바일 최대 너비에 맞춰 한 줄 말줄임한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill(
    "Very long group name for ellipsis verification",
  );
  await page.getByRole("button", { name: "그룹 생성" }).click();
  const groupName = page.locator(".group-status-name");

  for (const { width, maxWidth } of [
    { width: 1280, maxWidth: "180px" },
    { width: 390, maxWidth: "90px" },
  ]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(groupName).toHaveCSS("max-width", maxWidth);
    await expect(groupName).toHaveCSS("text-overflow", "ellipsis");
    await expect(groupName).toHaveCSS("overflow", "hidden");
    await expect(groupName).toHaveCSS("white-space", "nowrap");
    expect(await groupName.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  }
});
