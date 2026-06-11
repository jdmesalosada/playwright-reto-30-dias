import { Locator, Page } from "@playwright/test";

export class UserManagementMenu {

    readonly page: Page
    readonly userManagement: Locator
    readonly usersOption:Locator

    constructor(page: Page) {
        this.page = page
        this.userManagement = page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management') 
        this.usersOption = page.getByRole('menuitem', { name: 'Users' })
    }

    private async clickOnUserManagement(){
        await this.userManagement.click()
    }

    async clickOnUsers(){
        await this.clickOnUserManagement()
        await this.usersOption.click()
    }
}