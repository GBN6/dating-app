import { Role } from "../../core/auth/auth.model"

export interface UserRoles {
    id: number
    username: string
    roles: Role[]
}

export interface DialogData {
    roles: Role[]
    username: string
}
