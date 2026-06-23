import {test as setup, expect} from '@playwright/test'
import { LoginPage } from '../pageobjects/LoginPage'

setup('authentication as admin', async({page}) => {
    
    console.log('Autentication iniciada usando el setup')
    //iniciar sesion
    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    //nos aseguramos que el inicio de sesion es exitoso
    await expect(page.getByRole('link', {name: 'Admin'})).toBeVisible()

    //Guardar el estado
    await page.context().storageState({path: '.auth/admin.json'})

    console.log('Autenticacion completada usando el setup')

})


/*setup('authentication as employee', async({page}) => {

    
    await page.context().storageState({path: '.auth/employee.json'})
    

})*/
