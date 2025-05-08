import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpWithSnackbarService } from '../../shared/services/http-with-snackbar.service';
import { Observable } from 'rxjs';
import { AuthApi, LoginPayload } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
	private httpWithSnackbar = inject(HttpWithSnackbarService);
	private readonly API_URL = 'https://localhost:5001/api/account';

	public login(loginPayload: LoginPayload): Observable<AuthApi> {
		return this.httpWithSnackbar.post<AuthApi>(
			`${this.API_URL}/login`,
			'You successfully logged in.',
			loginPayload
		);
	}

	public register(registerPayload: {
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		password: string;
		confirmPassword: string;
	}): Observable<any> {
		return this.httpWithSnackbar.post<any>(
			`${this.API_URL}/register`,
			'You successfully registered.',
			registerPayload
		);
	}

	public logout() {
		return this.httpWithSnackbar.post<AuthApi>(`${this.API_URL}/logout`, 'You successfully logged out.', null);
	}
}
