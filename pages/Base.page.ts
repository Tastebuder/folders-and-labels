import { Page, Locator } from '@playwright/test';

export default abstract class BasePage {

    // Variables
    readonly page: Page;
    // Generic locators
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly deleteButton: Locator;
    readonly deleteItem: Locator;
    readonly editButton: Locator;
    readonly alerts: Locator;
    readonly requiredFieldMessage: Locator;

    constructor(page: Page) {
        // Initialise all locators
        this.page = page;
        this.saveButton = page.locator('button', { hasText: 'Save' });
        this.cancelButton = page.locator('button', { hasText: 'Cancel' });
        this.deleteButton = page.locator('.alert-modal-footer button', { hasText: 'Delete' });
        this.deleteItem = page.getByTestId('folders/labels:item-delete');
        this.editButton = page.getByTestId('folders/labels:item-edit');
        this.alerts = page.locator('[role="alert"]');
        this.requiredFieldMessage = page.getByText('This field is required');
    }
}