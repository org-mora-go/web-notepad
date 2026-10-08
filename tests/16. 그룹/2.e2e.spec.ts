import { expect, test } from "@playwright/test";

test("2. 새 그룹 이름은 앞뒤 공백을 제거해 최대 60자로 저장하고 placeholder는 Group name이다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await page.locator('button[aria-controls="groups-panel"]').click();
  const nameInput = page.getByRole("textbox", { name: "새 그룹 이름" });
  await expect(nameInput).toHaveAttribute("placeholder", "Group name");
  await expect(nameInput).toHaveAttribute("maxlength", "60");

  await nameInput.fill(" Work ");
  await page.getByRole("button", { name: "그룹 생성" }).click();
  await expect(page.locator(".group-status-name")).toHaveText("Work");

  const longName = "A".repeat(70);
  await nameInput.fill(longName);
  await expect(nameInput).toHaveValue("A".repeat(60));
  await page.getByRole("button", { name: "그룹 생성" }).click();

  const names = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("web-notepad-storage")!).state.groups.map(
      (group: { name: string }) => group.name,
    ),
  );
  expect(names).toContain("Work");
  expect(names).toContain("A".repeat(60));
  expect(names).not.toContain(" Work ");
});
