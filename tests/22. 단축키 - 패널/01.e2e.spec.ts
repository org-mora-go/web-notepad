import { expect, test } from "@playwright/test";

import { shortcutsCommand } from "../__util__";

test("1. SHORTCUT 패널에 실제 키보드 단축키와 Shift+클릭 줄 범위 선택·해제 안내를 표시한다", async ({
  page,
}) => {
  await page.goto("/");
  await shortcutsCommand(page).click();

  const shortcutsPanel = page.locator("#shortcuts-panel");
  await expect(shortcutsPanel).toHaveAttribute("aria-hidden", "false");
  await expect(shortcutsPanel.locator(".shortcut-row dt")).toHaveText([
    "새 탭 추가",
    "활성 탭 닫기",
    "탭 간 이동",
    "내용 전체 선택",
    "오른쪽 패널로 이동",
    "왼쪽 패널로 이동",
    "탭 문자 삽입",
    "라인 범위 선택 및 해제",
  ]);
  await expect(shortcutsPanel.locator(".shortcut-row kbd")).toHaveText([
    "Option + Tab",
    "Option + Backspace",
    "Option + Arrow Up",
    "Option + Arrow Down",
    "Cmd + A",
    "Option + A",
    "Option + F12",
    "Option + F11",
    "Tab",
    "Shift + 클릭",
  ]);
  await expect(
    shortcutsPanel.locator(".shortcut-row").filter({ hasText: "라인 범위 선택 및 해제" }),
  ).toContainText("Shift + 클릭");
});
