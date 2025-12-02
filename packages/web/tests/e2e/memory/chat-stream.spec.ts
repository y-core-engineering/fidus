import { test, expect } from '@playwright/test';

test.describe('Chat Stream', () => {
  test('should send message and receive streamed response', async ({ page }) => {
    // Increase timeout for LLM response
    test.setTimeout(120000);

    // Navigate to the memory page
    await page.goto('http://localhost:3001/fidus-memory');

    // Wait for DOM content to be ready (don't wait for networkidle as it times out with streaming)
    await page.waitForLoadState('domcontentloaded');

    // Find the chat input - wait for it to be ready
    const chatInput = page.locator('textarea[placeholder*="Type"], input[placeholder*="Type"], textarea, input[type="text"]').first();
    await expect(chatInput).toBeVisible({ timeout: 30000 });

    // Type a short message
    await chatInput.fill('sag hallo');

    // Listen for network requests
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/memory/chat') && response.status() === 200,
      { timeout: 120000 }
    );

    // Submit the message (press Enter or click send button)
    await chatInput.press('Enter');

    // Wait for the response to start
    const response = await responsePromise;
    console.log('Response status:', response.status());
    console.log('Response headers:', response.headers());

    // Wait for assistant message to appear
    await expect(page.locator('text=Hallo').or(page.locator('text=hallo'))).toBeVisible({ timeout: 120000 });

    console.log('Test passed - message received!');
  });

  test('API direct test with fetch in browser', async ({ page }) => {
    // Increase timeout for LLM
    test.setTimeout(120000);

    await page.goto('http://localhost:3001/fidus-memory');

    // Listen to console
    page.on('console', msg => console.log('Browser:', msg.text()));

    // Execute fetch directly in browser context
    const result = await page.evaluate(async () => {
      const startTime = Date.now();
      console.log('Starting fetch at', startTime);
      try {
        const response = await fetch('/api/memory/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': 'playwright-test'
          },
          body: JSON.stringify({ user_id: 'playwright-test', message: 'test' })
        });

        console.log('Response status:', response.status, 'after', Date.now() - startTime, 'ms');

        if (!response.ok) {
          return { error: `HTTP ${response.status}`, ok: false, elapsed: Date.now() - startTime };
        }

        const reader = response.body?.getReader();
        if (!reader) {
          return { error: 'No reader', ok: false };
        }

        const decoder = new TextDecoder();
        let fullText = '';
        let chunkCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          chunkCount++;

          // Limit to first 10 chunks for speed
          if (chunkCount >= 10) {
            reader.cancel();
            break;
          }
        }

        return { ok: true, chunkCount, sample: fullText.substring(0, 500), elapsed: Date.now() - startTime };
      } catch (error: any) {
        console.log('Error after', Date.now() - startTime, 'ms:', error.message);
        return { error: error.message, stack: error.stack, ok: false, elapsed: Date.now() - startTime };
      }
    });

    console.log('Browser fetch result:', JSON.stringify(result, null, 2));
    expect(result.ok).toBe(true);
  });
});
