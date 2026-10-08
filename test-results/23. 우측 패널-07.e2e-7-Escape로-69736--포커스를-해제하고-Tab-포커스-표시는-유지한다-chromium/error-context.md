# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 23. 우측 패널/07.e2e.spec.ts >> 7. Escape로 우측 패널을 닫으면 하단 패널 버튼의 포커스를 해제하고 Tab 포커스 표시는 유지한다
- Location: tests/23. 우측 패널/07.e2e.spec.ts:5:5

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  locator('button[aria-controls="shortcuts-panel"]')
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" locator('button[aria-controls="shortcuts-panel"]') with timeout 5000ms
  - waiting for locator('button[aria-controls="shortcuts-panel"]')
    14 × locator resolved to <button type="button" aria-label="단축키 안내" aria-expanded="false" aria-controls="shortcuts-panel" class="status-command shortcut-command ">…</button>
       - unexpected value "inactive"

```

```yaml
- button "단축키 안내": SHORTCUT
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | import { RIGHT_PANEL_VIEWPORTS } from "./__constant__";
  4  | 
  5  | test("7. Escape로 우측 패널을 닫으면 하단 패널 버튼의 포커스를 해제하고 Tab 포커스 표시는 유지한다", async ({ page }) => {
  6  |   await page.goto("/");
  7  | 
  8  |   for (const { viewport, panelIds } of RIGHT_PANEL_VIEWPORTS) {
  9  |     await page.setViewportSize(viewport);
  10 | 
  11 |     for (const panelId of [...panelIds].reverse()) {
  12 |       const toggle = page.locator(`button[aria-controls="${panelId}"]`);
  13 |       const panel = page.locator(`#${panelId}`);
  14 |       await toggle.click();
  15 |       await expect(panel).toHaveAttribute("aria-hidden", "false");
  16 |       await expect(toggle).toBeFocused();
  17 |       await page.keyboard.press("Escape");
  18 |       await expect(panel).toHaveAttribute("aria-hidden", "true");
  19 |       await expect(toggle).not.toBeFocused();
  20 |       await expect(toggle).toHaveCSS("outline-style", "none");
  21 |       await expect(toggle).toHaveCSS("border-width", "0px");
  22 | 
  23 |       const visibleIds = await page.locator(".status-actions .status-command:visible").evaluateAll(
  24 |         (commands) => commands.map((command) => command.getAttribute("aria-controls")),
  25 |       );
  26 |       const index = visibleIds.indexOf(panelId);
  27 |       const fromNext = index < visibleIds.length - 1;
  28 |       const neighborId = visibleIds[fromNext ? index + 1 : index - 1];
  29 |       await page.locator(`button[aria-controls="${neighborId}"]`).focus();
  30 |       await page.keyboard.press(fromNext ? "Shift+Tab" : "Tab");
> 31 |       await expect(toggle).toBeFocused();
     |                            ^ Error: expect(locator).toBeFocused() failed
  32 |       await expect(toggle).not.toHaveCSS("outline-style", "none");
  33 |     }
  34 |   }
  35 | });
  36 | 
```