import { test } from "@playwright/test";

import { restoreStoredBookmark } from "../__util__";
import { expectRestoredBookmark } from "./__util__";

test("1. 색상과 줄 선택 정보가 없는 기존 북마크는 그린과 선택 없음으로 복원한다", async ({ page }) => {
  await restoreStoredBookmark(page, {});
  await expectRestoredBookmark(page, { tabColor: "green", pressedLines: [false, false, false] });
});
