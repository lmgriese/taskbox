import test, { expect } from "@playwright/test";

test('Login Form inputs', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?args=&id=loginscreen--filled-form&viewMode=story');
  const email = await page.inputValue('[data-testid="email"]');
  const password = await page.inputValue('[data-testid="password"]');
  await expect(email).toBe('email@provider.com');
  await expect(password).toBe('a-random-password');
});