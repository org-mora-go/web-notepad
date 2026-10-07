import { expect, test } from "@playwright/test";

test("2. Ungrouped를 최하단에 고정하고 나머지 그룹은 한글 우선 문자순으로 재정렬한다", async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("group-sort-seed")) return;

    const groups = [
      { id: "ungrouped", name: "Ungrouped", createdAt: 0 },
      { id: "zulu", name: "Zulu", createdAt: 1 },
      { id: "daram", name: "다람쥐", createdAt: 2 },
      { id: "alpha", name: "Alpha", createdAt: 3 },
      { id: "namu", name: "나무", createdAt: 4 },
      { id: "gabang", name: "가방", createdAt: 5 },
    ].map(({ id, name, createdAt }, index) => ({
      id,
      name,
      createdAt,
      tabs: [
        {
          id: `tab-${index + 1}`,
          title: name,
          content: "",
          savedContent: "",
          tabColor: "gray",
          pinned: false,
          bookmarked: false,
        },
      ],
      bookmarks: [],
      activeTabId: `tab-${index + 1}`,
      rightTabIds: [],
      activeRightTabId: null,
      activePane: "left",
      splitRatio: 0.5,
    }));

    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({ state: { activeGroupId: "ungrouped", groups }, version: 0 }),
    );
    sessionStorage.setItem("group-sort-seed", "true");
  });

  await page.goto("http://localhost:3000");
  const toggle = page.locator('button[aria-controls="groups-panel"]');
  const names = page.locator(".group-item .group-select strong");
  await toggle.click();

  await expect(names).toHaveText([
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Zulu",
    "Ungrouped",
  ]);

  const createInput = page.getByRole("textbox", { name: "새 그룹 이름" });
  await createInput.fill("Beta");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await expect(names).toHaveText([
    "가방",
    "나무",
    "다람쥐",
    "Alpha",
    "Beta",
    "Zulu",
    "Ungrouped",
  ]);

  await page.getByRole("button", { name: "Zulu 그룹 수정" }).click();
  await page.getByRole("textbox", { name: "Zulu 그룹 이름 수정" }).fill("Aardvark");
  await page.getByRole("button", { name: "그룹 수정 저장" }).click();
  const finalOrder = [
    "가방",
    "나무",
    "다람쥐",
    "Aardvark",
    "Alpha",
    "Beta",
    "Ungrouped",
  ];
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
