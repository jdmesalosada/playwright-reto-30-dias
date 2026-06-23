import * as fs from 'fs'

// Intenta extraer la fecha de expiración de un JWT a partir de su payload.
function getJwtExpiration(token: string): number | undefined {
    const parts = token.split('.')
    if (parts.length < 2) {
        return undefined
    }

    try {
        const payload = JSON.parse(
            Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
        )

        return typeof payload.exp === 'number' ? payload.exp : undefined
    } catch {
        return undefined
    }
}

// Verifica si el archivo de autenticación contiene una sesión aún válida.
export function hasValidAuthState(filePath: string): boolean {
    if (!fs.existsSync(filePath)) {
        return false
    }

    try {
        const state = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        const now = Math.floor(Date.now() / 1000)

        // Revisa si alguna cookie sigue vigente.
        const hasValidCookie = (state.cookies ?? []).some((cookie: { expires?: number | string | null }) => {
            if (cookie.expires === -1) {
                return true
            }

            return typeof cookie.expires === 'number' && cookie.expires > now
        })

        // También revisa tokens JWT guardados en localStorage si existen.
        const hasValidJwt = (state.origins ?? []).some((origin: { localStorage?: Array<{ name?: string; value?: string }> }) =>
            (origin.localStorage ?? []).some((item: { name?: string; value?: string }) => {
                const value = typeof item.value === 'string' ? item.value : ''
                const normalized = value.replace(/^"|"$/g, '')
                const expiration = getJwtExpiration(normalized)

                return typeof expiration === 'number' && expiration > now
            })
        )

        return hasValidCookie || hasValidJwt
    } catch (error) {
        console.warn(`No se pudo leer ${filePath}:`, error)
        return false
    }
}
