import { expect, test } from "@playwright/test";

test("2. Ungrouped를 최하단에 고정하고 나머지 그룹은 한글 우선 문자순으로 재정렬한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const toggle = page.locator('button[aria-controls="groups-panel"]');
  const names = page.locator(".group-item .group-select strong");
  const createInput = page.getByRole("textbox", { name: "새 그룹 이름" });
  const createButton = page.getByRole("button", { name: "그룹 생성" });
  await toggle.click();
  for (const { name, order } of [
    { name: "Zulu", order: ["Zulu", "Ungrouped"] },
    { name: "다람쥐", order: ["다람쥐", "Zulu", "Ungrouped"] },
    { name: "Alpha", order: ["다람쥐", "Alpha", "Zulu", "Ungrouped"] },
    { name: "나무", order: ["나무", "다람쥐", "Alpha", "Zulu", "Ungrouped"] },
    { name: "가방", order: ["가방", "나무", "다람쥐", "Alpha", "Zulu", "Ungrouped"] },
    { name: "Beta", order: ["가방", "나무", "다람쥐", "Alpha", "Beta", "Zulu", "Ungrouped"] },
  ]) {
    await createInput.fill(name);
    await expect(createButton).toBeEnabled();
    await createButton.click();
    await expect(names).toHaveText(order);
  }

  await page.getByRole("button", { name: "Zulu 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "Zulu 그룹 이름 수정" }).fill("가게");
  await page.getByRole("button", { name: "그룹 수정 저장" }).click();
  await expect(names).toHaveText(["가게", "가방", "나무", "다람쥐", "Alpha", "Beta", "Ungrouped"]);
  await page.getByRole("button", { name: "다람쥐 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "다람쥐 그룹 이름 수정" }).fill("Aardvark");
  await page.getByRole("button", { name: "그룹 수정 저장" }).click();
  const finalOrder = ["가게", "가방", "나무", "Aardvark", "Alpha", "Beta", "Ungrouped"];
  await expect(names).toHaveText(finalOrder);
  const search = page.getByRole("searchbox", { name: "그룹 검색" });
  await search.fill("a");
  await expect(names).toHaveText(["Aardvark", "Alpha", "Beta"]);
  await search.fill("r");
  await expect(names).toHaveText(["Aardvark", "Ungrouped"]);
  await search.fill("");
  await expect(names).toHaveText(finalOrder);
  await page.reload();
  await toggle.click();
  await expect(names).toHaveText(finalOrder);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(names).toHaveText(finalOrder);
});
