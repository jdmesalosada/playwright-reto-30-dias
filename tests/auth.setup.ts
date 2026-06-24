import { test as setup, expect } from '@playwright/test'
import * as path from 'path'
import { LoginPage } from '../pageobjects/LoginPage'
import { hasValidAuthState } from '../utils/authState'

// Ruta donde se guarda el estado de autenticación reutilizable para el proyecto.
const authStatePath = path.resolve(process.cwd(), '.auth', 'admin.json')

setup('authentication as admin', async ({ page }) => {
    // Si el estado guardado sigue siendo válido, se reutiliza y se evita volver a iniciar sesión.
    if (await hasValidAuthState(page, authStatePath)) {
        console.log('Auth state válido. Se omite el setup.')
        return
    }

    console.log('Autentication iniciada usando el setup')
    // Inicia sesión con el usuario administrador.
    const loginPage = new LoginPage(page)
    await loginPage.loginAsAdmin()

    // Verifica que el inicio de sesión haya sido exitoso.
    await expect(page.getByRole('link', {name: 'Admin'})).toBeVisible()

    // Guarda el nuevo estado de autenticación para reutilizarlo en otros tests.
    await page.context().storageState({ path: authStatePath })

    console.log('Autenticacion completada usando el setup')
})

/*setup('authentication as employee', async({page}) => {
    await page.context().storageState({path: '.auth/employee.json'})
})*/
