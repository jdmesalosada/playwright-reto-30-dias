import { Locator, Page } from "@playwright/test";

export class JobMenu {

    readonly page: Page
    readonly job: Locator
    readonly jobTitlesOption
    readonly payGradesOption

    constructor(page: Page) {
        this.page = page
        this.job = page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Job')
        this.jobTitlesOption = page.getByRole('menuitem', { name: 'Job Titles' })
        this.payGradesOption = page.getByRole('menuitem', { name: 'Pay Grades' })
    }


    private async clickObJob() {
        await this.job.click()
    }

    async clickOnJobTitles() {
        await this.clickObJob()
        await this.jobTitlesOption.click()
    }

    async clickOnPayGrades() {
        await  this.clickObJob()
        await this.payGradesOption.click()
    }
}