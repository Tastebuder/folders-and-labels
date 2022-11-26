import { chromium, FullConfig } from '@playwright/test';
import LoginPage from './pages/Login.page';

export default async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // baseUrl isn't detected here
    await page.goto('https://account.proton.me/login');
    const loginPage = new LoginPage(page);
    await loginPage.login('adamtesting5@proton.me', '0WlKhPL8IO6Tg*C');
    // Save signed-in state to 'storageState.json'.
    await page.context().storageState({ path: 'storageState.json' });
    await browser.close();
}