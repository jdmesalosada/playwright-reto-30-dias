import { expect, test } from "@playwright/test"
import { LoginPage } from "../pageobjects/LoginPage"
import { SideMenuOption, SidePanel } from "../components/SidePanel"

test('Get all the usernames registered', async ({ page }) => {

    const loginPage = new LoginPage(page)
    await loginPage.doLogin('Admin', 'admin123')

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    await page.getByRole('link', { name: 'Admin' }).click()

    await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management').click()
    await page.getByRole('menuitem', { name: 'Users' }).click()

    const rows = page.getByRole('table').getByRole('row')
    const usernames: string[] = []

    const rowCount = await rows.count()

    for (let i = 1; i < rowCount; i++) {

        const cell = rows.nth(i).getByRole('cell').nth(1)
        const username = await cell.textContent()

        if (username) {
            usernames.push(username)
        }
    }

    console.log(usernames)

})


test('Select specific user for edition', async ({ page }) => {

    const userForEdition = 'Belinda_Leuschke5123'

    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    await page.getByRole('link', { name: 'Admin' }).click()

    await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management').click()
    await page.getByRole('menuitem', { name: 'Users' }).click()

    const pencilToEdit = page
        .getByRole('table')
        .getByRole('row')
        .filter({ hasText: userForEdition })
        .locator('button')
        .filter({ has: page.locator('i.bi-pencil-fill') })


    await pencilToEdit.click()

    const currentUsername = await page.locator("//label[contains(., 'Username')]/parent::div/following-sibling::div/input")
        .inputValue()

    expect(currentUsername).toEqual(userForEdition)

    expect(page.locator("//label[contains(., 'Username')]/parent::div/following-sibling::div/input"))
        .toHaveValue(currentUsername)
})


test('Check user role options', async ({ page }) => {

    const expectedRoleOptions = ['-- Select --', 'Admin', 'ESS']

    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickOnOption(SideMenuOption.ADMIN)

    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
    const currentUserRoleOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()

    console.log(currentUserRoleOptions)

    expect(currentUserRoleOptions,
        'The options displayed in the User Role Dropdown do not match the expected options.').toEqual(expectedRoleOptions)


})


test('Filter by user admin', async ({ page }) => {

    await page.goto("https://www.google.com")
    await page.locator("xpath=//div[contains(., 'NonExisting')]").click()

    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickOnOption(SideMenuOption.ADMIN)

    await page.locator("xpath=//div[contains(., 'NonExisting')]").click()

    const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')

    //Filas que contienen el role admin
    const currentAdminRows = allBodyRows.filter({
        has: page.getByRole('cell').nth(2).getByText('Admin')
    })

    const expectedAdminCount = await currentAdminRows.count()
    console.log('Admin users before filtering: ', expectedAdminCount)


    // Aplicar filtro
    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
    await page.getByRole("listbox").getByRole('option', { name: 'Admin' }).click()
    await page.getByRole('button', { name: 'Search' }).click()


    //La tabla filtrada deberia tener exactamente la misma cantidad que encontramos
    await expect(allBodyRows).toHaveCount(expectedAdminCount)

    for (let i = 0; i < expectedAdminCount; i++) {
        await expect(allBodyRows.nth(i).getByRole('cell').nth(2)).toContainText('Admin')
    }

})

test('Capture all amounts', async ({ page }) => {

    const loginPage = new LoginPage(page)
    await loginPage.doLogin('Admin', 'admin123')

    /*await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    await page.getByRole('link', { name: 'Admin' }).click()

    await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management').click()
    await page.getByRole('menuitem', { name: 'Users' }).click()*/

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim')

    await page.waitForTimeout(4000)

    const rows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
    const amounts: number[] = []

    const rowCount = await rows.count()
    console.log("Number of rows", rowCount)

    for (let i = 1; i < rowCount; i++) {

        const cell = rows.nth(i).getByRole('cell').nth(7)
        const amount = await cell.textContent()

        console.log("this is the amount in text:", amount)
        
        if (amount === null) {
            continue;
        }
        const convertedNumber = parseFloat(amount?.replace(/,/g, '').trim())

        if (!Number.isNaN(convertedNumber)) {
            amounts.push(convertedNumber)
        }
    }

    console.log(amounts)

})