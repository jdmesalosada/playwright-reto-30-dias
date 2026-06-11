import { test, expect } from '@playwright/test'
import { LoginPage } from '../pageobjects/LoginPage'
import { TopBarMenu } from '../components/top-bar-menu/TopBarMenu'
import { SideMenuOption, SidePanel } from '../components/SidePanel'

test('Check left menu options', async ({ page }) => {


    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    const leftMenuItems = page.getByLabel('Sidepanel').getByRole('listitem')
    const currentMenuItemsCount = await leftMenuItems.count()
    console.log('Current menu items count', currentMenuItemsCount)

    const currentMenuItems: string[] = []

    for (let i = 0; i < currentMenuItemsCount; i++) {

        const menuText = await leftMenuItems.nth(i).innerText()
        currentMenuItems.push(menuText)
    }

    console.log(currentMenuItems)

    const expectedMenuItems = [
        'Admin',
        'PIM',
        'Leave',
        'Time',
        'Recruitment',
        'My Info',
        'Performance',
        'Dashboard',
        'Directory',
        'Maintenance',
        'Claim',
        'Buzz'
    ];

    expect(currentMenuItems).toEqual(expectedMenuItems)

})

test('Navigate through the left panel', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    const leftMenuItems = page.getByLabel('Sidepanel').getByRole('listitem')
    const currentMenuItemsCount = await leftMenuItems.count()

    for (let i = 0; i < currentMenuItemsCount; i++) {
        const menuItem = leftMenuItems.nth(i)
        const menuText = await menuItem.innerText()

        console.log('Current menu item', menuText)

        if (menuText !== 'Maintenance') {
            await menuItem.click()
        }
    }
})

test('Check all the qualification links', async({page}) => {

    const expectedPages = [
        {
            menu: 'Skills',
            url: '/web/index.php/admin/viewSkills'
        },
        {
            menu: 'Education', 
            url: '/web/index.php/admin/viewEducation'
        },
        {
            menu: 'Licenses', 
            url: '/web/index.php/admin/viewLicenses'
        },
        
    ]

    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    await page.getByRole('link', { name: 'Admin' }).click()

    await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Qualifications').click()

    const qualificationOptions = page.getByRole('menu').locator('li')

    for(let expectedPage of expectedPages){

        const menuOption = qualificationOptions.filter({hasText: expectedPage.menu})
        await menuOption.click()
        await expect(page).toHaveURL(new RegExp(expectedPage.url))

        await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('Qualifications').click()

    } 
})


test('testing topbar menu', async({page}) => {

    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    const sidePanel = new SidePanel(page)
    await sidePanel.clickOnOption(SideMenuOption.ADMIN)

    const topBarMenu = new TopBarMenu(page)
    await topBarMenu.job.clickOnJobTitles()
    await topBarMenu.job.clickOnPayGrades()

    await topBarMenu.userManagement.clickOnUsers()

})