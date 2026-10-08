import { expect, test } from "@playwright/test";

import { createGroup, groupsCommand, groupStatusName, readStoredState } from "../__util__";

test("2. 새 그룹 이름은 앞뒤 공백을 제거해 최대 60자로 저장하고 placeholder는 Group name이다", async ({
  page,
}) => {
  await page.goto("/");
  await groupsCommand(page).click();
  const nameInput = page.getByRole("textbox", { name: "새 그룹 이름" });
  await expect(nameInput).toHaveAttribute("placeholder", "Group name");
  await expect(nameInput).toHaveAttribute("maxlength", "60");

  await createGroup(page, " Work ");
  await expect(groupStatusName(page)).toHaveText("Work");

  await nameInput.fill("A".repeat(70));
  await expect(nameInput).toHaveValue("A".repeat(60));
  await page.getByRole("button", { name: "그룹 생성" }).click();

  const names = (await readStoredState(page)).groups.map((group) => group.name);
  expect(names).toContain("Work");
  expect(names).toContain("A".repeat(60));
  expect(names).not.toContain(" Work ");
});
