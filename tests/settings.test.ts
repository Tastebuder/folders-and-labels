import { test, expect } from '@playwright/test';
import FoldersAndLabelsSettingsPage from '../pages/FoldersAndLabelsSettings.page';

test.describe('folders and labels settings', async () => {

    let foldersAndLabelsSettingsPage: FoldersAndLabelsSettingsPage;

    test.beforeEach(async ({ page }) => {
        foldersAndLabelsSettingsPage = new FoldersAndLabelsSettingsPage(page);
        await foldersAndLabelsSettingsPage.goTo();
    });

    test.describe('adding folders & labels', async () => {

        test.afterAll(async () => {
            await foldersAndLabelsSettingsPage.deleteAllFolders();
            await foldersAndLabelsSettingsPage.deleteAllLabels();
        });

        test('should not be able to add a folder without a name', async () => {
            await foldersAndLabelsSettingsPage.addFolder('');
            expect(await foldersAndLabelsSettingsPage.requiredFieldMessage).toBeVisible();
            await foldersAndLabelsSettingsPage.cancelButton.click();
        });

        test('should not be able to add a label without a name', async () => {
            await foldersAndLabelsSettingsPage.addLabel('', 'Reef');
            expect(await foldersAndLabelsSettingsPage.requiredFieldMessage).toBeVisible();
            await foldersAndLabelsSettingsPage.cancelButton.click();
        });

        test('should add a folder', async () => {
            await foldersAndLabelsSettingsPage.addFolder('folder 1');
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'visible' });
            expect(await foldersAndLabelsSettingsPage.folderItems.count()).toBeGreaterThanOrEqual(1);
        });

        test('should add a label', async () => {
            await foldersAndLabelsSettingsPage.addLabel('label 1', 'Reef');
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'visible' });
            expect(await foldersAndLabelsSettingsPage.labelItems.count()).toBeGreaterThanOrEqual(1);
        });
    });

    test.describe('interacting with a folder', async () => {

        test.beforeEach(async () => {
            await foldersAndLabelsSettingsPage.addFolder('Important');
        });

        test.afterEach(async () => {
            await foldersAndLabelsSettingsPage.deleteAllFolders();
        });

        test('should edit a folder', async () => {
            await foldersAndLabelsSettingsPage.editFolder('Important', 'edited');
            expect(await foldersAndLabelsSettingsPage.folderItems.getByTitle('edited')).toBeVisible();
        });

        test('should add a child folder', async () => {
            await foldersAndLabelsSettingsPage.addFolder('Child Folder', 'Important');
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'visible' });
            expect(await foldersAndLabelsSettingsPage.folderItems.getByTitle('Important/Child Folder')).toBeVisible();
        });

        test('should delete a folder', async () => {
            await foldersAndLabelsSettingsPage.deleteFolder('Important');
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'visible' });
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'hidden' });
            expect(await foldersAndLabelsSettingsPage.folderItems.count()).toBe(0);
        });
    });

    test.describe('interacting with a label', async () => {
        test.beforeEach(async () => {
            await foldersAndLabelsSettingsPage.addLabel('Label', 'Pacific');
        });

        test.afterEach(async () => {
            await foldersAndLabelsSettingsPage.deleteAllLabels();
        });

        test('should edit a label', async () => {
            await foldersAndLabelsSettingsPage.editLabel('Label', 'New label name');
            expect(foldersAndLabelsSettingsPage.labelItems.getByTitle('New label name')).toBeVisible();
        });

        test('should change the color of the label', async () => {
            const selectedColor = await foldersAndLabelsSettingsPage.editLabel('Label', 'Label', 'Reef');
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'visible' });
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'hidden' });
            const labelImgColor = await foldersAndLabelsSettingsPage
                .labelItems
                .getByTitle('Label')
                .locator('..')
                .locator('svg')
                .evaluate(e => getComputedStyle(e).fill);
            expect(selectedColor).toBe(labelImgColor);
        });
    });

    test.describe('interacting with multiple folders', async () => {
        test.beforeEach(async () => {
            await foldersAndLabelsSettingsPage.addFolder('Junk');
            await foldersAndLabelsSettingsPage.addFolder('Important');
        });

        test('should sort folders alphabetically', async () => {
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'hidden' });
            const expectedFolderOrder = await (await foldersAndLabelsSettingsPage.getAllParentFolderNames()).sort();
            await foldersAndLabelsSettingsPage.sortFolders();
            const actualFolderOrder = await foldersAndLabelsSettingsPage.getAllParentFolderNames();
            expect(actualFolderOrder).toEqual(expectedFolderOrder);
        });
    });

    test.describe('interacting with multiple labels', async () => {
        test.beforeEach(async () => {
            await foldersAndLabelsSettingsPage.addLabel('Purple', 'Purple');
            await foldersAndLabelsSettingsPage.addLabel('Copper', 'Copper');
        });

        test('should sort labels alphabetically', async () => {
            await foldersAndLabelsSettingsPage.alerts.waitFor({ state: 'hidden' });
            const expectedLabelOrder = await (await foldersAndLabelsSettingsPage.getAllLabelNames()).sort();
            await foldersAndLabelsSettingsPage.sortLabels();
            const actualLabelOrder = await foldersAndLabelsSettingsPage.getAllLabelNames();
            expect(actualLabelOrder).toEqual(expectedLabelOrder);
        });
    });
});