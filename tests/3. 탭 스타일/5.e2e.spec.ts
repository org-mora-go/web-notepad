import { expect, test } from "@playwright/test";

test("5. 탭 색상과 줄 번호 배경을 동기화한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator("textarea").fill("first\nsecond\nthird");
  const tab = page.locator(".tab-item.is-active");
  const colorButton = tab.locator(".dirty-dot");
  const lineNumbers = page.locator(".line-rail [role='button']");
  const colors = [
    {
      name: "gray",
      line: "rgba(184, 184, 176, 0.2)",
      text: "rgb(184, 184, 176)",
      stripe: "184, 184, 176",
      tabBackground: "rgba(184, 184, 176, 0.16)",
    },
    {
      name: "blue",
      line: "rgba(169, 201, 245, 0.2)",
      text: "rgb(169, 201, 245)",
      stripe: "169, 201, 245",
      tabBackground: "rgba(169, 201, 245, 0.16)",
    },
    {
      name: "green",
      line: "rgba(143, 227, 176, 0.2)",
      text: "rgb(143, 227, 176)",
      stripe: "143, 227, 176",
      tabBackground: "rgba(143, 227, 176, 0.16)",
    },
  ];

  await expect(lineNumbers.nth(1)).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );

  for (const [index, color] of colors.entries()) {
    await expect(tab).toHaveAttribute("data-tab-color", color.name);
    await expect(tab).toHaveCSS("background-color", color.tabBackground);
    await lineNumbers.first().click();
    await expect(lineNumbers.first()).toHaveCSS("background-color", color.line);
    await expect(lineNumbers.first()).toHaveCSS("color", color.text);
    await expect(tab).toHaveCSS("box-shadow", new RegExp(color.stripe));
    await lineNumbers.first().click();
    await expect(lineNumbers.first()).toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    if (index < colors.length - 1) await colorButton.click();
  }
});
