import {Page} from "@playwright/test"

export class Navigate {

    readonly page: Page

    constructor(page: Page) {
        this.page = page

    }

    async toDashboard(){
        await this.page.goto('/web/index.php/dashboard/index')
    }

}