import { inject, Injectable } from '@angular/core';
import { USER_DATA } from './auth.tokens';
import { BehaviorSubject, distinctUntilKeyChanged, map, Observable, tap } from 'rxjs';
import { AuthState, LoginPayload, RegisterPayload, UserData } from './auth.model';
import { AuthApiService } from './auth-api.service';
import { JwtService } from './jwt/jwt.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
	private authApiService = inject(AuthApiService);
	private jwtService = inject(JwtService);

	private _authState$ = new BehaviorSubject<AuthState>({
		userData: null,
	});

	public static useIsAuthorized$() {
		return inject(USER_DATA).pipe(map((userData) => Boolean(userData)));
	}

	public getUserDataValue() {
		return this._authState$.value.userData;
	}

	public register(registerPayload: RegisterPayload) {
		return this.authApiService
			.register(registerPayload)
			.pipe(tap(({ token, userData }) => this.setLoggedData(token, userData)));
	}

	public login(loginPayload: LoginPayload) {
		return this.authApiService
			.login(loginPayload)
			.pipe(tap(({ token, userData }) => this.setLoggedData(token, userData)));
	}

	public logout() {
		return this.authApiService.logout().pipe(
			tap(() => {
				this.setUserData(null);
				this.jwtService.removeToken();
			})
		);
	}

	public initializeAuth() {
		if (this.jwtService.isTokenValid()) {
			this.authApiService.getUserData().subscribe((user) => {
				console.log(user);
				this.setUserData(user);
			});
		}
	}

	private setLoggedData(token: string, userData: UserData) {
		this.jwtService.saveToken(token);
		this.setUserData(userData);
	}

	private setUserData(userData: UserData | null) {
		this.patchState({ userData });
	}

	private patchState(stateSlice: Partial<AuthState>) {
		this._authState$.next({ ...this._authState$.value, ...stateSlice });
	}

	public getStateSlice$<K extends keyof AuthState>(key: K): Observable<AuthState[K]> {
		return this._authState$.pipe(
			distinctUntilKeyChanged(key),
			map((state: AuthState) => state[key])
		);
	}
}
