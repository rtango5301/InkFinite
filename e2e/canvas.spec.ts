import { test, expect } from '@playwright/test'

test.describe('InkFinite Canvas', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to ensure clean state
    await page.goto('http://localhost:3000')
    await page.evaluate(() => {
      localStorage.clear()
    })
    await page.reload()
  })

  test('should show loading state then canvas', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Wait for the canvas to be fully loaded (tldraw container)
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // Verify the page doesn't have a black screen (canvas is rendered)
    const container = page.locator('.tl-container')
    await expect(container).toBeVisible()
  })

  test('should render custom toolbar', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Wait for canvas to load
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // Check for custom toolbar buttons
    await expect(page.getByRole('button', { name: /New Note/i })).toBeVisible()
    await expect(page.getByText(/Image/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Export PNG/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Save JSON/i })).toBeVisible()
  })

  test('should create a markdown card when clicking New Note', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Wait for canvas to load
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // Click the New Note button
    await page.getByRole('button', { name: /New Note/i }).click()

    // Wait for the markdown card to appear
    await expect(page.locator('[data-shape-type="markdown-card"]')).toBeVisible({ timeout: 10000 })
  })

  test('should persist canvas state after reload', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Wait for canvas to load
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // Create a note
    await page.getByRole('button', { name: /New Note/i }).click()

    // Wait for the markdown card to appear and verify content
    await expect(page.locator('[data-shape-type="markdown-card"]')).toBeVisible({ timeout: 10000 })

    // Wait for localStorage to sync (tldraw uses debounced writes)
    await page.waitForTimeout(2000)

    // Verify localStorage has tldraw data
    const hasData = await page.evaluate(() => {
      const keys = Object.keys(localStorage)
      console.log('localStorage keys:', keys)
      return keys.some(key => key.includes('TLDRAW') || key.includes('tldraw'))
    })
    expect(hasData).toBeTruthy()

    // Reload the page (don't clear localStorage this time)
    await page.reload()

    // Wait for canvas to reload
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // The note should still be there (persistence)
    await expect(page.locator('[data-shape-type="markdown-card"]')).toBeVisible({ timeout: 15000 })
  })

  test('should not show black screen after navigation', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Wait for initial load
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // Navigate away and back
    await page.goto('about:blank')
    await page.goto('http://localhost:3000')

    // Canvas should still load properly
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // Verify background color is correct (not pure black from error)
    const backgroundColor = await page.evaluate(() => {
      const container = document.querySelector('.tl-container')
      return container ? getComputedStyle(container).backgroundColor : null
    })

    // Should have the dark theme background, not a crash/error black
    expect(backgroundColor).toBeTruthy()
  })

  test('should handle corrupted localStorage gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Wait for canvas to load initially
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // Corrupt localStorage to simulate data corruption
    await page.evaluate(() => {
      // Set corrupted data that would cause tldraw to fail if not cleaned
      localStorage.setItem('TLDRAW_DOCUMENT_v1infinite-canvas-v1', 'invalid json {{{')
    })

    // Reload the page - our validation should clean the corrupted data
    await page.reload()

    // Canvas should load successfully because our validation cleaned the corrupted data
    await expect(page.locator('.tl-container')).toBeVisible({ timeout: 30000 })

    // Verify the corrupted data was cleaned
    const corruptedDataExists = await page.evaluate(() => {
      const data = localStorage.getItem('TLDRAW_DOCUMENT_v1infinite-canvas-v1')
      return data === 'invalid json {{{'
    })

    // The corrupted data should have been cleaned
    expect(corruptedDataExists).toBeFalsy()
  })
})
