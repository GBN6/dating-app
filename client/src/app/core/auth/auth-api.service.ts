import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpWithSnackbarService } from '../../shared/services/http-with-snackbar.service';
import { Observable } from 'rxjs';
import { AuthApi, LoginPayload, RegisterPayload, UserData } from './auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
	private http = inject(HttpClient);
	private httpWithSnackbar = inject(HttpWithSnackbarService);
	private readonly API_URL = environment.API_URL;

	public login(loginPayload: LoginPayload): Observable<AuthApi> {
		return this.httpWithSnackbar.post<AuthApi>(
			`${this.API_URL}/account/login`,
			'You successfully logged in.',
			loginPayload
		);
	}

	public register(registerPayload: RegisterPayload): Observable<AuthApi> {
		return this.httpWithSnackbar.post<AuthApi>(
			`${this.API_URL}/account/register`,
			'You successfully registered.',
			registerPayload
		);
	}

	public logout(): Observable<AuthApi> {
		return this.httpWithSnackbar.post<AuthApi>(
			`${this.API_URL}/account/logout`,
			'You successfully logged out.',
			null
		);
	}

	public getUserData(): Observable<UserData> {
		return this.http.get<UserData>(`${this.API_URL}/users/profile`);
	}
}
