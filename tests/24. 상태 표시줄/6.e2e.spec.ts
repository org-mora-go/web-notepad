import { expect, test } from "@playwright/test";

test("6. 상태표시줄 명령의 아이콘과 텍스트 간격을 PC·모바일에서 유지한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const commands = page.locator(".status-actions .status-command");

  for (const [width, expectedGap] of [[1280, "7px"], [390, "5px"]] as const) {
    await page.setViewportSize({ width, height: 844 });
    for (const command of await commands.all()) {
      await expect(command).toHaveCSS("gap", expectedGap);
    }
  }
});
