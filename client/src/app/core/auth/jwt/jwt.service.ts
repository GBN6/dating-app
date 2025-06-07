import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
	providedIn: 'root',
})
export class JwtService {
	private _token = localStorage.getItem('token');
	private _decodedToken: JwtPayload | null = null;

	private readonly secondInMs = 1000;

	get token() {
		return this._token;
	}

	get decodedToken() {
		return this._decodedToken;
	}

	private decodeToken() {
		if (this._token) this._decodedToken = jwtDecode<JwtPayload>(this._token);
	}

	private isTokenExpired(): boolean | void {
		this.decodeToken();
		const expirationTime = this._decodedToken?.exp;
		if (expirationTime) {
			const expirationDate = new Date(expirationTime * this.secondInMs);
			return expirationDate.getTime() - Date.now() < 0;
		}
		return true;
	}

	public isTokenValid(): boolean {
		if (this._token) return !this.isTokenExpired();
		console.log;

		return false;
	}

	public saveToken(token: string): void {
		this._token = token;
		this.decodeToken();
		localStorage.setItem('token', token);
	}

	public removeToken(): void {
		localStorage.removeItem('token');
		this._token = null;
	}
}
