import { expect, test } from "@playwright/test";

test("7. 모바일에서 탭과 탭 조작 버튼의 기본 파란 터치 강조 효과를 숨긴다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");

  const addTabButton = page.getByRole("button", { name: "새 탭 추가" });
  const tapHighlight = "rgba(0, 0, 0, 0)";
  await expect(addTabButton).toHaveCSS(
    "-webkit-tap-highlight-color",
    tapHighlight,
  );
  await addTabButton.click();
  await expect(page.getByRole("tab")).toHaveCount(2);
  await expect(addTabButton).toHaveCSS(
    "-webkit-tap-highlight-color",
    tapHighlight,
  );

  const tabItems = page.locator(".tab-item");
  for (let index = 0; index < 2; index += 1) {
    await expect(tabItems.nth(index).getByRole("tab")).toHaveCSS(
      "-webkit-tap-highlight-color",
      tapHighlight,
    );
  }
  await tabItems.first().getByRole("tab").click();
  await expect(tabItems.first().getByRole("tab")).toHaveCSS(
    "-webkit-tap-highlight-color",
    tapHighlight,
  );
  await expect(tabItems.first().locator(".tab-close")).toHaveCSS(
    "-webkit-tap-highlight-color",
    tapHighlight,
  );
});
