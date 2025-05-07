import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpWithSnackbarService } from '../../shared/services/http-with-snackbar.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
	private httpWithMessage = inject(HttpWithSnackbarService);
	private readonly API_URL = 'https://localhost:5001/api/account';

	public login(loginPayload: { username: string; password: string }): Observable<any> {
		return this.httpWithMessage.post<any>(`${this.API_URL}/login`, 'You successfully logged in.', loginPayload);
	}

	public register(registerPayload: {
		username: string;
		email: string;
		firstName: string;
		lastName: string;
		password: string;
		confirmPassword: string;
	}): Observable<any> {
		return this.httpWithMessage.post<any>(
			`${this.API_URL}/register`,
			'You successfully registered.',
			registerPayload
		);
	}
}
