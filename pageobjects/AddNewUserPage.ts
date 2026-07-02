import { Page, expect } from "@playwright/test";

export class AddNewUserPage {

    private readonly page: Page

    constructor(page: Page) {
        this.page = page

    }

    async clickOnAdd() {
        await this.page.getByText('Add').click()
    }

    async selectUserRole(userRole: string) {
        await this.page.locator('div.oxd-grid-item--gutters')
            .filter({ has: this.page.getByText('User Role') })
            .locator('div.oxd-select-text-input')
            .click()

        await this.page.getByText(userRole, { exact: true }).click()
    }

    async selectEmployeeName(employeeName: string) {
        await this.page.getByRole('textbox', { name: 'Type for hints...' })
            .fill(employeeName)

        await this.page.getByText('Qwerty Qwerty LName', { exact: true }).click()

    }

    async selectStatus(status: string) {
        await this.page.locator('div.oxd-grid-item--gutters')
            .filter({ has: this.page.getByText('Status') })
            .locator('div.oxd-select-text-input')
            .click()

        await this.page.getByText(status).click()
    }

    async enterUsername(username: string) {
        await this.page.locator('div.oxd-grid-item--gutters')
            .filter({ has: this.page.getByText('Username') })
            .getByRole('textbox')
            .fill(username)
    }

    async enterPassword(password: string) {
        await this.page.locator('div.oxd-grid-item--gutters')
            .filter({ has: this.page.getByText('Password', { exact: true }) })
            .getByRole('textbox')
            .fill(password)
    }

    async enterConfirmPassword(password: string) {
        await this.page.locator('div.oxd-grid-item--gutters')
            .filter({ has: this.page.getByText('Confirm Password', { exact: true }) })
            .getByRole('textbox')
            .fill(password)
    }

    async clickOnSave(){
        await this.page.getByRole('button', {name: 'Save'}).click()
    }

    async checkUserWasAddedMessage(){
        await expect(this.page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')
    }

}