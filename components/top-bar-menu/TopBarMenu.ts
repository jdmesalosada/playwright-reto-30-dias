import { Page } from "@playwright/test";
import { UserManagementMenu } from "./UserManagementMenu";
import { JobMenu } from "./JobMenu";

export class TopBarMenu {

    private readonly page:Page
    readonly userManagement: UserManagementMenu
    readonly job: JobMenu

    constructor(page: Page){
        this.page = page
        this.userManagement = new UserManagementMenu(page)
        this.job = new JobMenu(page)
    }

}