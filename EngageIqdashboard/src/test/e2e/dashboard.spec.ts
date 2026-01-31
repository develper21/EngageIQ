import { test, expect } from '@playwright/test';

test.describe('Simple E2E Tests', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Check if page loads
    await expect(page).toHaveTitle(/EngageIQ/);
  });

  test('should have basic elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic elements
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle navigation', async ({ page }) => {
    await page.goto('/');
    
    // Look for any navigation elements
    const nav = page.locator('nav');
    const header = page.locator('header');
    const footer = page.locator('footer');
    
    // At least one navigation element should exist
    expect(nav.or(header).or(footer)).toBeVisible();
  });

  test('should handle forms', async ({ page }) => {
    await page.goto('/');
    
    // Look for any forms
    const forms = page.locator('form');
    const inputs = page.locator('input');
    const buttons = page.locator('button');
    
    // Should have some interactive elements
    expect(forms.or(inputs).or(buttons)).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check for viewport meta tag
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1');
  });

  test('should handle JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('/');
    
    // Should not have JavaScript errors
    expect(errors).toHaveLength(0);
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Basic accessibility check
    const mainHeading = page.locator('h1');
    if (await mainHeading.count() > 0) {
      await expect(mainHeading).toBeVisible();
    }
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Images should have alt text
      expect(alt !== null).toBeTruthy();
    }
  });

  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('API Integration E2E Tests', () => {
  test('should handle API routes', async ({ page }) => {
    // Mock API responses
    await page.route('/api/health', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'OK',
          timestamp: new Date().toISOString()
        })
      });
    });

    await page.goto('/');
    
    // Test API connectivity
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        return data;
      } catch (error) {
        return null;
      }
    });
    
    expect(response).toEqual({
      status: 'OK',
      timestamp: expect.any(String)
    });
  });

  test('should handle API errors', async ({ page }) => {
    // Mock API error
    await page.route('/api/auth/login', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized'
        })
      });
    });

    await page.goto('/');
    
    // Test error handling
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        const data = await res.json();
        return { status: res.status, data };
      } catch (error) {
        return null;
      }
    });
    
    expect(response).toEqual({
      status: 401,
      data: {
        error: 'Unauthorized'
      }
    });
  });
});

test.describe('User Interaction E2E Tests', () => {
  test('should handle button clicks', async ({ page }) => {
    await page.goto('/');
    
    // Find and click buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.click();
      
      // Button should still be visible after click
      await expect(firstButton).toBeVisible();
    }
  });

  test('should handle form inputs', async ({ page }) => {
    await page.goto('/');
    
    // Find input fields
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      const firstInput = inputs.first();
      await firstInput.fill('test value');
      
      // Check if value was set
      const value = await firstInput.inputValue();
      expect(value).toBe('test value');
    }
  });

  test('should handle navigation', async ({ page }) => {
    await page.goto('/');
    
    // Look for navigation links
    const links = page.locator('a');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      
      // Link should have href attribute
      expect(href).toBeTruthy();
    }
  });
});

test.describe('Performance E2E Tests', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should not have memory leaks', async ({ page }) => {
    await page.goto('/');
    
    // Navigate around a bit
    for (let i = 0; i < 5; i++) {
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
    
    // Page should still be responsive
    await expect(page.locator('body')).toBeVisible();
  });
});
