import { inject, Injectable, signal } from '@angular/core';
import { USER_DATA } from './auth.tokens';
import { BehaviorSubject, distinctUntilKeyChanged, map, Observable, tap } from 'rxjs';
import { AuthState, LoginPayload, RegisterPayload, UserData } from './auth.model';
import { AuthApiService } from './auth-api.service';
import { JwtService } from './jwt/jwt.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
	public static useIsAuthorized$() {
		return inject(USER_DATA).pipe(map((userData) => Boolean(userData)));
	}

	private authApiService = inject(AuthApiService);
	private jwtService = inject(JwtService);

	private _isLoggedIn = signal(false);

	private _authState$ = new BehaviorSubject<AuthState>({
		userData: null,
	});

	public isLoggedIn = this._isLoggedIn.asReadonly();

	public getUserData$(): Observable<AuthState> {
		return this._authState$.asObservable();
	}

	public getUserDataValue(): UserData | null {
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
				this._isLoggedIn.set(false);
			})
		);
	}

	public initializeAuth() {
		if (this.jwtService.isTokenValid()) {
			this._isLoggedIn.set(true);
			this.authApiService
				.getUserData()
				.pipe(tap((user) => this.setUserData(user)))
				.subscribe();
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
