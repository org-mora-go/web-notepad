import { test } from "@playwright/test";

import { restoreStoredBookmark } from "../__util__";
import { expectRestoredBookmark } from "./__util__";

test("2. 기존 블루 북마크를 레드로 복원하고 잘못된 선택 줄을 정리한다", async ({ page }) => {
  await restoreStoredBookmark(page, {
    tabColor: "blue",
    selectedLines: [2, 1, 1, -1, 3, 0.5, "0"],
  });
  await expectRestoredBookmark(page, { tabColor: "red", pressedLines: [false, true, true] });
});
