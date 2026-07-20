import { expect, test } from "@playwright/test"
import { LoginPage } from "../pageobjects/LoginPage"
import { SideMenuOption, SidePanel } from "../components/SidePanel"
import { TopBarMenu } from "../components/top-bar-menu/TopBarMenu"
import { Navigate } from "../pageobjects/Navigate"
import { AddNewUserPage } from "../pageobjects/AddNewUserPage"
import { UserModel } from "../models/UserModel"
import { UserFactory } from "../factory/UserFactory"
import { UsersTable } from "../components/UsersTable"

test('Get all the usernames registered', async ({ page }) => {

    await page.goto("/web/index.php/dashboard/index")

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

    const sidePanel = new SidePanel(page)
    await sidePanel.clickOnOption(SideMenuOption.ADMIN)

    await page.locator("//label[contains(.,'User Role')]/parent::div/following-sibling::div").click()
    const currentUserRoleOptions = await page.getByRole('listbox').getByRole('option').allInnerTexts()

    console.log(currentUserRoleOptions)

    expect(currentUserRoleOptions,
        'The options displayed in the User Role Dropdown do not match the expected options.').toEqual(expectedRoleOptions)


})


test('Filter by user admin', async ({ page }) => {

    const navigate = new Navigate(page)
    await navigate.toDashboard()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickOnOption(SideMenuOption.ADMIN)

    const topBarMenu = new TopBarMenu(page)
    await topBarMenu.userManagement.clickOnUsers()

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

test('capture all amounts', async ({ page }) => {

    await page.goto('/web/index.php/claim/viewAssignClaim')

    const allBodyRows = page.getByRole('table').getByRole('rowgroup').nth(1).getByRole('row')
    const amounts: number[] = []

    const rowCount = await allBodyRows.count()
    console.log('Number of rows', rowCount)

    for (let i = 0; i < rowCount; i++) {

        const amountCell = allBodyRows.nth(i).getByRole('cell').nth(7)
        const amountText = await amountCell.textContent()
        console.log("This is the amount in text: ", amountText)

        if (amountText === null) {
            continue
        }

        const convertedNumber = parseFloat(amountText?.replace(/,/g, '').trim())

        amounts.push(convertedNumber)

    }

    console.log(amounts)

    let total = 0

    for (let amount of amounts) {
        total += amount
    }

    console.log("total is", total)

})


test('Add new user admin', async ({ page }) => {

    const navigate = new Navigate(page)
    await navigate.toUsers()

    const usersTable = new UsersTable(page)
    await usersTable.editFirstAdminOnTheTable()

    const addNewUserPage = new AddNewUserPage(page)
    const fullUserToSearch = await addNewUserPage.getEmployeeName()

    const adminUser = UserFactory.createAdmin({
        employee: fullUserToSearch
    })

    await page.goBack()
    await addNewUserPage.addNewUser(adminUser)
    await addNewUserPage.checkUserWasAddedMessage()
})

test('Delete user admin', async ({ page }) => {

    //Arrange
    const navigate = new Navigate(page)
    await navigate.toUsers()

    const usersTable = new UsersTable(page)
    await usersTable.editFirstAdminOnTheTable()

    const addNewUserPage = new AddNewUserPage(page)
    const fullUserToSearch = await addNewUserPage.getEmployeeName()

    const adminUser = UserFactory.createAdmin({
        employee: fullUserToSearch
    })

    await page.goBack()
    await addNewUserPage.addNewUser(adminUser)
    await addNewUserPage.checkUserWasAddedMessage()

    //Act
    await usersTable.clickOnDeleteActionByUsername(adminUser.username)
    await usersTable.acceptDeleteUser()

    //Assert
    await addNewUserPage.checkUserWasSuccessfullyDeletedMessage()

})
