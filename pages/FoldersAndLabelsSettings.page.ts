import { Page, Locator } from '@playwright/test';
import BasePage from './Base.page';

export default class FoldersAndLabelsSettingsPage extends BasePage {

    // Variables
    readonly page: Page;
    readonly url: string = '/u/3/mail/folders-labels';
    public selectedColorRGB: string;
    // Folder Locators
    readonly useFolderColorsToggle: Locator;
    readonly addFolderButton: Locator;
    readonly sortFoldersButton: Locator;
    readonly folderNameInput: Locator;
    readonly folderLocationDropdown: Locator;
    readonly folderLocationItem: Locator;
    readonly parentFolderItems: Locator;
    readonly folderItems: Locator;
    readonly notifications: Locator;
    // Label Locators
    readonly addLabelButton: Locator;
    readonly sortLabelsButton: Locator;
    readonly labelNameInput: Locator;
    readonly colorDropdown: Locator;
    readonly colorOption: Locator;
    readonly labelItems: Locator;

    constructor(page: Page) {
        super(page);
        // Initialise all locators
        this.page = page;
        this.useFolderColorsToggle = page.locator('#folder-colors');
        this.addFolderButton = page.locator('button', { hasText: 'Add folder' });
        this.sortFoldersButton = page.getByTitle('Sort folders alphabetically');
        this.folderNameInput = page.locator('input#folder');
        this.folderLocationDropdown = page.locator('#parentID');
        this.folderLocationItem = page.locator('.dropdown-item button');
        this.parentFolderItems = page.locator('#folderlist > div > ul > li');
        this.folderItems = page.locator('#folderlist ul li');
        this.notifications = page.locator('#notification');
        this.addLabelButton = page.locator('button', { hasText: 'Add label' });
        this.sortLabelsButton = page.getByTitle('Sort labels alphabetically');
        this.labelNameInput = page.getByPlaceholder('Label name');
        this.colorDropdown = page.locator('#color-button');
        this.colorOption = page.locator('.color-selector-item');
        this.labelItems = page.getByTestId('folders/labels:item-type:label');
    }

    /**
     * A method to navigate to the FoldersAndLabelsSettingsPage
     */
    async goTo(): Promise<void> {
        await this.page.goto(this.url);
    }

    /**
     * A method for adding a new folder
     * @param name Name for the folder
     * @param parent Optional parent folder
     */
    async addFolder(name: string, parent?: string): Promise<void> {
        await this.addFolderButton.click();
        await this.folderNameInput.fill(name);
        if (parent) {
            await this.folderLocationDropdown.click();
            await this.folderLocationItem.getByText(parent).click();
        }
        await this.saveButton.click();
    }

    /**
     * A method to get all the parent folder names
     * @returns An array of all parent folder names
     */
    async getAllParentFolderNames(): Promise<string[]> {
        const totalItems = await this.folderItems.count();
        let folderNames: string[] = [];
        for (let i = 0; i < totalItems; i++) {
            await this.folderItems.nth(i).getAttribute('title').then((title) => {
                if (title) folderNames.push(title);
            });
        }
        return folderNames;
    }

    /**
     * Click the sort folders button and wait for the network request to complete.
     */
    async sortFolders(): Promise<void> {
        await Promise.all([
            // Ensure each sort has been processed, as playwright moves too fast
            this.page.waitForRequest(request => request.url().includes('/order') && request.method() === 'PUT'),
            this.page.waitForResponse(response => response.url().includes('/api/v4/events') && response.status() === 200),
            await this.sortFoldersButton.click()
        ]);
    }

    /**
     * A method for editing an existing folder
     * @param currentName Pass the name of the folder and if it's a child folder then pass the parent name too e.g. 'parent/child'
     * @param newName Optional new name for the folder
     * @param location Optional choose the parent folder
     * @param notifications Optionally toggle on or off notifications
     */
    async editFolder(currentName: string, newName?: string, location?: string, notifications?: boolean): Promise<void> {
        await this.folderItems.getByTitle(currentName)
            .locator('..')
            .locator('..')
            .getByText('Edit').click();

        if (newName) {
            await this.folderNameInput.clear();
            await this.folderNameInput.fill(newName);
        }

        if (location) {
            await this.folderLocationDropdown.click();
            await this.folderLocationItem.filter({ hasText: location }).click();
        }

        if (notifications) {
            const currentState: boolean = await this.notifications.isChecked();
            if (currentState !== notifications) {
                await this.notifications.check();
            }
        }

        await this.saveButton.click();
    }

    /**
     * A method for deleting a single existing folder
     * @param folderName The name of the folder to delete
     */
    async deleteFolder(folderName: string): Promise<void> {
        await this.folderItems.getByTitle(folderName)
            .locator('..')
            .locator('..')
            .getByTestId('dropdown:open')
            .click();
        await this.deleteItem.click();
        await this.deleteButton.click();
    }

    /**
     * A method for adding a new label
     * @param name Name for the label
     * @param color Choose a color for the label
     */
    async addLabel(name: string, color: string) {
        await this.addLabelButton.click();
        await this.labelNameInput.fill(name);
        await this.colorDropdown.click();
        await this.page.getByTitle(color).click();
        await this.saveButton.click();
    }

    /**
     * A method to get all the label names
     * @returns An array of all label names
     */
    async getAllLabelNames(): Promise<string[]> {
        const totalItems = await this.labelItems.count();
        let labelNames: string[] = [];
        for (let i = 0; i < totalItems; i++) {
            await this.labelItems.nth(i).getByTestId('folders/labels:item-name').getAttribute('title').then((title) => {
                if (title) labelNames.push(title);
            });
        }
        return labelNames;
    }

    /**
     * Click the sort folders button and wait for the network request to complete.
     */
    async sortLabels(): Promise<void> {
        await Promise.all([
            // Ensure each sort has processed, as playwright moves too fast
            this.page.waitForRequest(request => request.url().includes('/order') && request.method() === 'PUT'),
            this.page.waitForResponse(response => response.url().includes('/api/v4/events') && response.status() === 200),
            await this.sortLabelsButton.click()
        ]);
    }

    /**
     * A method for editing an existing label
     * @param currentName Name of the label to edit
     * @param name Optional new name for the label
     * @param color Optional new color for the label
     */
    async editLabel(currentName: string, name?: string, color?: string): Promise<string | void> {
        await this.labelItems
            .getByTitle(currentName)
            .locator('..')
            .locator('..')
            .locator('..')
            .getByText('Edit')
            .click();

        if (name) {
            await this.labelNameInput.clear();
            await this.labelNameInput.fill(name);
        }

        if (color) {
            await this.colorDropdown.click();
            const rgb = await this.page.getByTitle(color).evaluate(e => getComputedStyle(e).color);
            await this.page.getByTitle(color).click();
            await this.saveButton.click();
            return rgb;
        } else {
            await this.saveButton.click();
        }

    }

    /**
     * A method to tidy up folders after a test case
     */
    async deleteAllFolders(): Promise<void> {
        const totalFolders = await this.folderItems.count();
        for (let i = 0; i < totalFolders; i++) {
            await this.folderItems.first().getByTestId('dropdown:open').click();
            await this.deleteItem.click();
            // Note that Promise.all prevents a race condition between clicking and waiting for the request.
            await Promise.all([
                // Ensure each delete has processed before trying the next one, as playwright moves too fast
                this.page.waitForRequest(request => request.url().includes('/api/v4/labels') && request.method() === 'DELETE'),
                this.page.waitForResponse(response => response.url().includes('/api/v4/events') && response.status() === 200),
                this.page.waitForRequest(request => request.url().includes('/api/v4/events') && request.method() === 'GET'),
                this.page.waitForResponse(response => response.url().includes('/api/v4/events') && response.status() === 200),
                await this.deleteButton.click()
            ]);
        }
    }

    /**
     * A method to tidy up labels after a test case
     */
    async deleteAllLabels(): Promise<void> {
        const totalLabels = await this.labelItems.count();
        for (let i = 0; i < totalLabels; i++) {
            await this.labelItems.first().getByTestId('dropdown:open').click();
            await this.deleteItem.click();
            // Note that Promise.all prevents a race condition between clicking and waiting for the request.
            await Promise.all([
                // Ensure each delete has processed before trying the next one, as playwright moves too fast
                this.page.waitForRequest(request => request.url().includes('/api/v4/labels') && request.method() === 'DELETE'),
                this.page.waitForResponse(response => response.url().includes('/api/v4/events') && response.status() === 200),
                this.page.waitForRequest(request => request.url().includes('/api/v4/events') && request.method() === 'GET'),
                this.page.waitForResponse(response => response.url().includes('/api/v4/events') && response.status() === 200),
                await this.deleteButton.click()
            ]);
        }
    }
}