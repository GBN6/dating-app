import { Photo } from '../../modules/members/members.model';

export interface AuthState {
	userData: UserData | null;
}

export interface UserData {
	id: number;
	username: string;
	age: number;
	email: string;
	firstName: string;
	lastName: string;
	photoUrl: string;
	knownAs: string;
	created: Date;
	lastActive: Date;
	gender: string;
	introduction: string;
	interests: string;
	lookingFor: string;
	city: string;
	country: string;
	photos: Photo[];
}

export interface AuthApi {
	token: string;
	userData: UserData;
}

export interface LoginPayload {
	username: string;
	password: string;
}

export interface RegisterPayload {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	gender: string | null;
	password: string;
}
