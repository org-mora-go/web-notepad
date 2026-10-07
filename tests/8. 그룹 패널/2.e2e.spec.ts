import { expect, test } from "@playwright/test";

test("2. Ungrouped를 최상단에 고정하고 나머지 그룹은 한글 우선 문자순으로 재정렬한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const toggle = page.locator('button[aria-controls="groups-panel"]');
  const names = page.locator(".group-item .group-select strong");
  for (const { name, order } of [
    { name: "Zulu", order: ["Ungrouped", "Zulu"] },
    { name: "다람쥐", order: ["Ungrouped", "다람쥐", "Zulu"] },
    { name: "Alpha", order: ["Ungrouped", "다람쥐", "Alpha", "Zulu"] },
    { name: "나무", order: ["Ungrouped", "나무", "다람쥐", "Alpha", "Zulu"] },
    { name: "가방", order: ["Ungrouped", "가방", "나무", "다람쥐", "Alpha", "Zulu"] },
    { name: "Beta", order: ["Ungrouped", "가방", "나무", "다람쥐", "Alpha", "Beta", "Zulu"] },
  ]) {
    if (await toggle.getAttribute("aria-expanded") === "false") await toggle.click();
    await page.getByRole("textbox", { name: "새 그룹 이름" }).fill(name);
    await page.getByRole("button", { name: "그룹 생성" }).click();
    await toggle.click();
    await expect(names).toHaveText(order);
  }

  await page.getByRole("button", { name: "Zulu 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "Zulu 그룹 이름 수정" }).fill("가게");
  await page.getByRole("button", { name: "그룹 수정 저장" }).click();
  await expect(names).toHaveText(["Ungrouped", "가게", "가방", "나무", "다람쥐", "Alpha", "Beta"]);
  await page.getByRole("button", { name: "다람쥐 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "다람쥐 그룹 이름 수정" }).fill("Aardvark");
  await page.getByRole("button", { name: "그룹 수정 저장" }).click();
  const finalOrder = ["Ungrouped", "가게", "가방", "나무", "Aardvark", "Alpha", "Beta"];
  await expect(names).toHaveText(finalOrder);
  const search = page.getByRole("searchbox", { name: "그룹 검색" });
  await search.fill("a");
  await expect(names).toHaveText(["Aardvark", "Alpha", "Beta"]);
  await search.fill("r");
  await expect(names).toHaveText(["Ungrouped", "Aardvark"]);
  await search.fill("");
  await expect(names).toHaveText(finalOrder);
  await page.reload();
  await toggle.click();
  await expect(names).toHaveText(finalOrder);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(names).toHaveText(finalOrder);
});