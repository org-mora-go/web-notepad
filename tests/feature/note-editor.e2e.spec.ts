import { expect, test } from '@playwright/test';

test('긴 메모의 끝까지 스크롤해도 라인 번호가 에디터와 정렬 상태를 유지한다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const editor = page.locator('textarea').first();
	await editor.fill(Array.from({ length: 120 }, (_, index) => `line ${index + 1}`).join('\n'));
	await editor.evaluate((element) => {
		element.scrollTop = element.scrollHeight;
		element.dispatchEvent(new Event('scroll', { bubbles: true }));
	});

	await expect.poll(async () => {
		return page.locator('.note-editor').evaluate((element) => {
			const editor = element.querySelector('textarea');
			const lineRail = element.querySelector<HTMLElement>('.line-rail');
			if (!editor || !lineRail) return null;

			return {
				scrollOffsetDifference: editor.scrollTop - lineRail.scrollTop,
				maxScrollDifference:
					editor.scrollHeight - editor.clientHeight -
					(lineRail.scrollHeight - lineRail.clientHeight),
			};
		});
	}).toEqual({
		scrollOffsetDifference: 0,
		maxScrollDifference: 0,
	});
});

test('Tab 키는 캐럿 위치에 한 번만 삽입되며 한글 조합이 끝날 때까지 대기한다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const editor = page.locator('textarea').first();
	await editor.fill('left right');
	await editor.evaluate((element) => (element as HTMLTextAreaElement).setSelectionRange(4, 4));
	await page.keyboard.press('Tab');
	await expect(editor).toHaveValue('left\t right');
	await expect
		.poll(() => editor.evaluate((element) => (element as HTMLTextAreaElement).selectionStart))
		.toBe(5);

	await editor.fill('더ㅑㄹ');
	await editor.evaluate((element) => (element as HTMLTextAreaElement).setSelectionRange(1, 1));
	await editor.evaluate((element) =>
		element.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true })),
	);
	await page.keyboard.press('Tab');
	await expect(editor).toHaveValue('더ㅑㄹ');

	await editor.evaluate((element) => {
		const textarea = element as HTMLTextAreaElement;
		type TestWindow = Window & {
			__tabTestQueuedFrames?: FrameRequestCallback[];
			__tabTestOriginalRequestAnimationFrame?: typeof window.requestAnimationFrame;
		};
		const testWindow = window as TestWindow;
		testWindow.__tabTestQueuedFrames = [];
		testWindow.__tabTestOriginalRequestAnimationFrame = window.requestAnimationFrame;
		window.requestAnimationFrame = (callback) => {
			testWindow.__tabTestQueuedFrames?.push(callback);
			return testWindow.__tabTestQueuedFrames?.length ?? 0;
		};
		textarea.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
		const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
		setValue?.call(textarea, '더한글ㅑㄹ');
		textarea.setSelectionRange(3, 3);
		textarea.dispatchEvent(new Event('input', { bubbles: true }));
	});

	await page.keyboard.press('Tab');
	await expect(editor).toHaveValue('더한글ㅑㄹ');
	await editor.evaluate(() => {
		type TestWindow = Window & {
			__tabTestQueuedFrames?: FrameRequestCallback[];
			__tabTestOriginalRequestAnimationFrame?: typeof window.requestAnimationFrame;
		};
		const testWindow = window as TestWindow;
		const queuedFrames = testWindow.__tabTestQueuedFrames ?? [];
		const originalRequestAnimationFrame = testWindow.__tabTestOriginalRequestAnimationFrame;
		if (originalRequestAnimationFrame) {
			window.requestAnimationFrame = originalRequestAnimationFrame;
		}
		delete testWindow.__tabTestQueuedFrames;
		delete testWindow.__tabTestOriginalRequestAnimationFrame;
		for (const callback of queuedFrames) callback(performance.now());
	});
	await expect(editor).toHaveValue('더한글\tㅑㄹ');
	await expect
		.poll(() => editor.evaluate((element) => (element as HTMLTextAreaElement).selectionStart))
		.toBe(4);
});

test('실행 취소와 다시 실행 단축키가 편집 내용을 되돌리고 복원한다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const editor = page.locator('textarea').first();
	await editor.fill('first');
	await editor.fill('first second');
	await expect(editor).toHaveValue('first second');

	await page.keyboard.press('Meta+z');
	await expect(editor).toHaveValue('first');

	await page.keyboard.press('Meta+Shift+z');
	await expect(editor).toHaveValue('first second');
});

test('실행 취소 기록이 없을 때 Undo를 눌러도 내용이 바뀌지 않는다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const editor = page.locator('textarea').first();
	await expect(editor).toHaveValue('');

	await page.keyboard.press('Meta+z');
	await expect(editor).toHaveValue('');
});

test('다시 실행 기록이 없을 때 Redo를 눌러도 내용이 바뀌지 않는다', async ({ page }) => {
	await page.goto('http://localhost:3000');

	const editor = page.locator('textarea').first();
	await editor.fill('untouched by redo');

	await page.keyboard.press('Meta+Shift+z');
	await expect(editor).toHaveValue('untouched by redo');
});
