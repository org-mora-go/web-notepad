import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import {
  bookmarkActiveTab,
  createGroups,
  groupsCommand,
  groupStatusName,
  readActiveGroup,
  readStoredState,
} from "../__util__";

test("6. 그룹 이름 수정은 저장·취소 버튼과 Enter·Escape를 지원하고 그룹 ID, 노트와 북마크를 유지한다", async ({ page }) => {
  await page.goto("/");
  await createGroups(page, "Work");
  await bookmarkActiveTab(page, "private note");
  const originalId = (await readStoredState(page)).activeGroupId;
  await groupsCommand(page).click();
  await page.getByRole("button", { name: "Work 그룹 수정" }).click();
  const nameInput = page.getByRole("textbox", { name: "Work 그룹 이름 수정" });
  await nameInput.fill(" Focus ");
  await nameInput.press("Enter");
  await expect(groupStatusName(page)).toHaveText("Focus");
  await expect(page.locator("textarea")).toHaveValue("private note");

  const editButton = page.getByRole("button", { name: "Focus 그룹 수정" });
  const focusInput = page.getByRole("textbox", { name: "Focus 그룹 이름 수정" });
  await editButton.click();
  await focusInput.fill("Cancelled");
  await page.getByRole("button", { name: "그룹 수정 취소" }).click();
  await expect(groupStatusName(page)).toHaveText("Focus");
  await editButton.click();
  await focusInput.fill("Escaped");
  await focusInput.press("Escape");
  await expect(focusInput).toHaveCount(0);
  await expect(groupStatusName(page)).toHaveText("Focus");
  await page.reload();
  await expect(groupStatusName(page)).toHaveText("Focus");
  await expect(page.locator("textarea")).toHaveValue("private note");
  expect((await readStoredState(page)).activeGroupId).toBe(originalId);
  expect((await readActiveGroup(page)).bookmarks[0].content).toBe("private note");

  await page.setViewportSize(MOBILE_VIEWPORT);
  await groupsCommand(page).click();
  await editButton.click();
  await focusInput.fill("Mobile");
  const saveButton = page.getByRole("button", { name: "그룹 수정 저장" });
  await expect(saveButton).toBeInViewport();
  await saveButton.click();
  await expect(groupStatusName(page)).toHaveText("Mobile");
  await expect(page.locator("textarea")).toHaveValue("private note");
});
