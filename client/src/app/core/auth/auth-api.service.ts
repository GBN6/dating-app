import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
	private http = inject(HttpClient);
	private readonly API_URL = 'https://localhost:5001/api/account/login';

	public login(login: { username: string; password: string }) {
		return this.http.post(`${this.API_URL}`, login);
	}
}
