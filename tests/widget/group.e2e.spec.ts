import { expect, test } from "@playwright/test";

test("그룹별 노트와 북마크가 분리되고 그룹 삭제 시 Ungrouped로 이동한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");

  await page.getByRole("button", { name: "Ungrouped (1)" }).click();
  await expect(
    page.getByRole("button", { name: "Ungrouped 그룹 삭제" }),
  ).toHaveCount(0);
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await expect(page.getByRole("button", { name: "Work (2)" })).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("");

  await page.locator("textarea").fill("Work note");
  await page
    .locator('.tab-item.is-active [role="tab"]')
    .click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();

  await page.getByRole("button", { name: "Work (2)" }).click();
  await expect(page.getByRole("button", { name: "Ungrouped" })).toBeVisible();
  await page.getByRole("button", { name: "Ungrouped" }).click();
  await expect(
    page.getByRole("button", { name: "Ungrouped (2)" }),
  ).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("");
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator(".bookmark-empty")).toContainText(
    "Empty Bookmarks",
  );
  await page.getByRole("button", { name: "북마크 닫기" }).click();

  await page.getByRole("button", { name: "Ungrouped (2)" }).click();
  await page.getByRole("button", { name: "Work", exact: true }).click();
  await expect(page.getByRole("button", { name: "Work (2)" })).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("Work note");
  await page.reload();
  await expect(page.getByRole("button", { name: "Work (2)" })).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("Work note");

  await page.getByRole("button", { name: "Work (2)" }).click();
  await page.getByRole("button", { name: "Work 그룹 삭제" }).click();
  await expect(
    page.getByRole("button", { name: "Ungrouped (1)" }),
  ).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("Work note");
  await page.getByRole("button", { name: "그룹 닫기" }).click();
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator(".bookmark-item")).toContainText("Work note");
});

test("기존 평면 데이터는 Ungrouped에 유지된다", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({
        state: {
          tabs: [
            {
              id: "tab-1",
              title: "Legacy note",
              content: "Legacy content",
              savedContent: "Legacy content",
              urgent: false,
              pinned: false,
              bookmarked: true,
              updatedAt: 1,
            },
          ],
          activeTabId: "tab-1",
          rightTabIds: [],
          activeRightTabId: null,
          activePane: "left",
          splitRatio: 0.5,
          nextTabNumber: 2,
          bookmarks: [
            {
              id: "bookmark-tab-1",
              sourceTabId: "tab-1",
              title: "Legacy note",
              content: "Legacy content",
              createdAt: 1,
            },
          ],
          groups: [{ id: "group-old", name: "Old group", createdAt: 1 }],
        },
        version: 0,
      }),
    );
  });
  await page.goto("http://localhost:3000");

  await expect(page.locator("textarea")).toHaveValue("Legacy content");
  await page.getByRole("button", { name: "Ungrouped (2)" }).click();
  await page.getByRole("button", { name: "Ungrouped", exact: true }).click();
  await expect(page.locator("textarea")).toHaveValue("Legacy content");
  await page.getByRole("button", { name: "BOOKMARK" }).click();
  await expect(page.locator(".bookmark-item")).toContainText("Legacy content");
});

test("공백 이름으로는 그룹을 생성하지 않고 유효한 이름으로 새 작업공간을 만든다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "Ungrouped (1)" }).click();

  const nameInput = page.getByRole("textbox", { name: "새 그룹 이름" });
  const createButton = page.getByRole("button", { name: "그룹 생성" });
  await expect(createButton).toBeDisabled();
  await nameInput.fill("   ");
  await expect(createButton).toBeDisabled();
  await expect(page.locator(".group-item")).toHaveCount(1);

  await nameInput.fill("Notes");
  await createButton.click();
  await expect(page.getByRole("button", { name: "Notes (2)" })).toBeVisible();
  await expect(page.locator("textarea")).toHaveValue("");
});

test("그룹 검색은 대소문자를 구분하지 않고 검색 결과가 없음을 표시한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "Ungrouped (1)" }).click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Work");
  await page.getByRole("button", { name: "그룹 생성" }).click();

  await page.getByRole("button", { name: "Work (2)" }).click();
  await page.getByRole("textbox", { name: "새 그룹 이름" }).fill("Personal");
  await page.getByRole("button", { name: "그룹 생성" }).click();

  await page.getByRole("button", { name: "Personal (3)" }).click();
  const search = page.getByRole("searchbox", { name: "그룹 검색" });
  await search.fill("WORK");
  await expect(page.locator(".group-item")).toHaveCount(1);
  await expect(page.locator(".group-item")).toContainText("Work");

  await search.fill("missing");
  await expect(page.locator(".group-item")).toHaveCount(0);
  await expect(page.locator(".widget-search-empty")).toContainText(
    "검색 결과가 없습니다",
  );
});
