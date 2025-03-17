import { test, expect } from '@playwright/test';
import { constants } from 'buffer';

test('Check screenshots of existing storybooks', async ({ page }) => {
  test.setTimeout(300000)
  const storybookConfig : any = await (await page.request.get('index.json')).json();
  const storybooks = Object.keys(storybookConfig.entries).filter(entry => storybookConfig.entries[entry].type === 'story');
  const errors :any[] = [];
  for(let story of storybooks) {
    await page.goto(`iframe.html?globals=&args=&id=${story}&viewMode=story`);
    await expect(page.locator('#storybook-root')).toBeVisible();
    await expect(page.locator('.sb-preparing-story .sb-loader')).not.toBeVisible();
    await page.waitForTimeout(1000);
    try{
      await expect(page).toHaveScreenshot(`${story}.png`, {fullPage: true});
    } catch(e) {
      errors.push(e.message);
    }
  }
  if(errors.length > 0) {
    const errorMessage = `${errors.join('/n')}`;
    throw new Error(errorMessage);
  }
});
