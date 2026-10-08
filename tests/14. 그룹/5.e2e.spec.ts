import { expect, test } from "@playwright/test";

test("5. 그룹 생성 영역은 기존 톤을 유지하고 추가 버튼만 밝게 표시한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();

  await expect(page.locator(".group-create-form")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(page.getByRole("textbox", { name: "새 그룹 이름" })).toHaveCSS(
    "background-color",
    "rgb(21, 21, 20)",
  );
  const createButton = page.getByRole("button", { name: "그룹 생성" });
  await expect(createButton).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(createButton).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(createButton).toHaveCSS("border-color", "rgb(80, 80, 80)");
});
