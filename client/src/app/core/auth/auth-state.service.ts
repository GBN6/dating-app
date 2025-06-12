import { inject, Injectable, signal } from '@angular/core';
import { USER_DATA } from './auth.tokens';
import { BehaviorSubject, distinctUntilKeyChanged, map, Observable, tap } from 'rxjs';
import { AuthState, LoginPayload, RegisterPayload, UserData } from './auth.model';
import { AuthApiService } from './auth-api.service';
import { JwtService } from './jwt/jwt.service';
import { LikesService } from '../../shared/services/likes.service';
import { PresenceService } from '../../shared/services/presence.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
	public static useIsAuthorized$() {
		return inject(USER_DATA).pipe(map((userData) => Boolean(userData)));
	}

	private readonly authApiService = inject(AuthApiService);
	private readonly jwtService = inject(JwtService);
	private readonly likeService = inject(LikesService);
	private readonly presenceService = inject(PresenceService);

	private _isLoggedIn = signal(false);
	private _roles = signal<string[] | null>(null);

	private _authState$ = new BehaviorSubject<AuthState>({
		userData: null,
	});

	public isLoggedIn = this._isLoggedIn.asReadonly();
	public roles = this._roles.asReadonly();
	public userData$ = this._authState$.asObservable();

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
				this.presenceService.stopHubConnection();
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
			this.presenceService.createHubConnection(this.jwtService.token!);
		}
	}

	public setUserData(userData: UserData | null) {
		this.patchState({ userData });
		this.likeService.getLikeIds$().subscribe();
		this._roles.set(this.jwtService.getRolesFromToken());
	}

	private setLoggedData(token: string, userData: UserData) {
		this._isLoggedIn.set(true);
		this.jwtService.saveToken(token);
		this.setUserData(userData);
		this.presenceService.createHubConnection(token);
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
