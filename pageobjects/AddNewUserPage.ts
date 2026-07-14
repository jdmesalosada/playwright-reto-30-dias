import { Page, expect } from "@playwright/test";
import { UserModel } from "../models/UserModel";

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

        //await this.page.getByText(userRole, { exact: true }).click()
        await this.page.getByRole('option', { name: userRole }).click()
    }

    async selectEmployeeName(employeeName: string) {
        await this.page.getByRole('textbox', { name: 'Type for hints...' })
            .fill(employeeName)

        await this.page.getByText(employeeName, { exact: true }).click()

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

    async clickOnSave() {
        await this.page.getByRole('button', { name: 'Save' }).click()
    }

    async checkUserWasAddedMessage() {
        await expect(this.page.locator('p.oxd-text--toast-message')).toHaveText('Successfully Saved')
    }

    async addNewUser(user: UserModel) {
        await this.clickOnAdd()
        await this.selectUserRole(user.role)
        await this.selectEmployeeName(user.employee)
        await this.selectStatus(user.status)
        await this.enterUsername(user.username)
        await this.enterPassword(user.password)
        await this.enterConfirmPassword(user.confirmPassword)
        await this.clickOnSave()
    }

    async getEmployeeName(): Promise<string> {
        const fullUserToSearch = await this.page.getByRole('textbox', { name: 'Type for hints...' }).inputValue()
        console.log(`User to search ${fullUserToSearch}`)
        return fullUserToSearch
    }

}