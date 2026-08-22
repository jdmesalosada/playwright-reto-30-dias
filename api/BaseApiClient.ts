import { APIRequestContext, expect } from "@playwright/test"
import { readFile } from 'fs/promises'
import * as path from 'path'

export abstract class BaseApiClient {

    protected readonly request: APIRequestContext
    protected readonly baseUrl = 'https://opensource-demo.orangehrmlive.com'
    protected readonly cookieName = 'orangehrm'
    protected readonly cookieHeader: string

    protected constructor(request: APIRequestContext, cookieHeader: string) {
        this.request = request
        this.cookieHeader = cookieHeader
    }

    protected static async loadAuthenticationCookie(): Promise<string> {
        const authFilePath = path.resolve(process.cwd(), '.auth', 'admin.json')

        const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
            cookies?: Array<{ name: string, value: string }>
        }

        const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name = 'orangehrm')
        expect(orangeHrmCookie, 'The oranagehrm cookie was not found in the saved auth state').toBeTruthy()

        return `orangehrm=${orangeHrmCookie?.value}`

    }

    protected buildUrl(endpoint: string): string {
        return `${this.baseUrl}${endpoint}`
    }

    protected getHeaders(): Record<string, string> {
        return {
            Cookie: this.cookieHeader,
            Accept: 'application/json'
        }
    }

    protected async get(endpoint: string) {
        return this.request.get(this.buildUrl(endpoint), {
            headers: this.getHeaders()
        })
    }

    protected async post(endpoint: string, data: unknown) {
        return this.request.post(this.buildUrl(endpoint), {
            headers: this.getHeaders(),
            data
        })
    }

    protected async delete(endpoint: string, data: unknown) {
        return this.request.delete(this.buildUrl(endpoint), {
            headers: this.getHeaders(),
            data
        })
    }
}