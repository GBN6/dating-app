export interface AuthState {
	userData: UserData | null;
}

export interface UserData {
	id: string;
	username: string;
}

export interface AuthApi {
	token: string;
	userData: UserData;
}

export interface LoginPayload {
	username: string;
	password: string;
}
