import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { createGroup, groupsCommand } from "../__util__";

test("5. 그룹 패널의 제목, 그룹 이름, 검색 결과 없음 문구와 입력란의 글자 크기·높이를 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();

  const panel = page.locator("#groups-panel");
  const search = panel.locator('.search-field input[placeholder="Search groups"]');
  const createInput = panel.locator('input[aria-label="새 그룹 이름"]');
  await createGroup(page, "Alpha");

  await panel.locator('button[aria-label="Alpha 그룹 수정"]').click();
  const editInput = panel.locator('input[aria-label="Alpha 그룹 이름 수정"]');
  await expect(editInput).toHaveCSS("font-size", "15px");
  await expect(editInput).toHaveCSS("height", "36px");
  await editInput.press("Escape");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await expect(panel.locator("h2")).toHaveCSS("font-size", "22px");
    await expect(search).toHaveCSS("font-size", "14px");
    await expect(search).toHaveCSS("height", "40px");
    await expect(search.locator("xpath=..")).toHaveCSS("height", "42px");
    await expect(createInput).toHaveCSS("font-size", "14px");
    await expect(createInput).toHaveCSS("height", "42px");
    await expect(
      panel.locator('.group-item:has-text("Alpha") strong'),
    ).toHaveCSS("font-size", "15px");
  }

  await search.fill("no matching group");
  await expect(page.locator(".search-empty-state p")).toHaveCSS(
    "font-size",
    "15px",
  );
});
