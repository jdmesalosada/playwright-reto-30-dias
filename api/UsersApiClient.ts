import { APIRequestContext } from "@playwright/test";
import { BaseApiClient } from "./BaseApiClient";

export type CreateUserPayload = {
    username: string
    password: string
    status: boolean
    userRoleId: number
    empNumber: number
}


export class UsersApiClient extends BaseApiClient {

    private constructor(request: APIRequestContext, cookieHeader: string) {
        super(request, cookieHeader)
    }

    static async fromSavedAuthState(request: APIRequestContext): Promise<UsersApiClient> {
        const cookieHeader = await BaseApiClient.loadAuthenticationCookie()
        return new UsersApiClient(request, cookieHeader)
    }

    async getUsers() {
        return this.get('/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC')
    }

    async createUser(user: CreateUserPayload) {
        return this.post('/web/index.php/api/v2/admin/users', user)
    }

    async deleteUsers(userId: number | number[]) {
        const ids = Array.isArray(userId) ? userId : [userId]
        return this.delete('/web/index.php/api/v2/admin/users', { ids })
    }

}