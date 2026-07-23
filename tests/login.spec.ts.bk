import { expect, test } from '@playwright/test'
import {LoginPage} from '../pageobjects/LoginPage'
import { SideMenuOption, SidePanel } from '../components/SidePanel'

test('Login to hrm', async ({ page }) => {

    await page.goto("/web/index.php/dashboard/index")

    const sidePanel = new SidePanel(page)
    await sidePanel.clickOnOption(SideMenuOption.ADMIN)
    await sidePanel.clickOnOption(SideMenuOption.BUZZ)
    await sidePanel.clickOnOption(SideMenuOption.DASHBOARD)

})

test('Login to hrm 2', async ({ page }) => {

    await page.goto("/web/index.php/dashboard/index")

    const sidePanel = new SidePanel(page)
    await sidePanel.clickOnOption(SideMenuOption.ADMIN)
    await sidePanel.clickOnOption(SideMenuOption.BUZZ)
    await sidePanel.clickOnOption(SideMenuOption.DASHBOARD)

})