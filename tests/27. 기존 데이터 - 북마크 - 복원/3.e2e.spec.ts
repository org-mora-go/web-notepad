import { test } from "@playwright/test";

import { restoreStoredBookmark } from "../__util__";
import { expectRestoredBookmark } from "./__util__";

test("3. 기존 북마크의 그레이 색상과 첫 줄 선택을 유지한다", async ({ page }) => {
  await restoreStoredBookmark(page, { tabColor: "gray", selectedLines: [0] });
  await expectRestoredBookmark(page, { tabColor: "gray", pressedLines: [true, false, false] });
});
