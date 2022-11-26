import { Page, Locator } from '@playwright/test';

export default class LoginPage {

    // Variables
    readonly page: Page;
    readonly url: string = '/login';
    // Locators
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly stayLoggedIn: Locator;

    constructor(page: Page) {
        // Initialise all locators
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.signInButton = page.locator('button[type="submit"]');
        this.stayLoggedIn = page.locator('#staySignedIn');
    }

    /**
     * Navigate to the login page
     */
    async goTo(): Promise<void> {
        await this.page.goto(this.url);
    }

    /**
     * A method to login with an existing user
     * @param username Existing username
     * @param password Existings password
     */
    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.stayLoggedIn.click();
        await this.signInButton.click();
        await this.page.waitForSelector('button[data-testid="heading:userdropdown"]');
    }
}