import { expect, test } from "@playwright/test";

test("3. 그룹 검색 결과에 Ungrouped가 포함되면 최상단에 둔다", async ({ page }) => {
  await page.addInitScript(() => {
    const groups = [
      { id: "ungrouped", name: "Ungrouped", createdAt: 0 },
      { id: "zulu", name: "Zulu", createdAt: 1 },
      { id: "aardvark", name: "Aardvark", createdAt: 2 },
      { id: "burger", name: "Burger", createdAt: 3 },
    ].map(({ id, name, createdAt }, index) => ({
      id,
      name,
      createdAt,
      tabs: [{ id: `tab-${index + 1}`, title: name, content: "" }],
      bookmarks: [],
      activeTabId: `tab-${index + 1}`,
    }));

    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({ state: { activeGroupId: "ungrouped", groups }, version: 0 }),
    );
  });

  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  const names = page.locator(".group-item .group-select strong");
  const search = page.getByRole("searchbox", { name: "그룹 검색" });

  await search.fill("r");
  await expect(names).toHaveText(["Ungrouped", "Aardvark", "Burger"]);
  await search.fill("U");
  await expect(names).toHaveText(["Ungrouped", "Burger", "Zulu"]);
  await search.fill("a");
  await expect(names).toHaveText(["Aardvark"]);
});
