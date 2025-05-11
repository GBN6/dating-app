import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthStateService } from './auth-state.service';

export class AuthGuards {
	public static authenticated(): CanActivateFn {
		return () => {
			const router = inject(Router);

			return AuthStateService.useIsAuthorized$().pipe(
				tap((isAuthorized) => (isAuthorized ? true : router.navigateByUrl('/')))
			);
		};
	}

	public static notAuthenticated(): CanActivateFn {
		return () => {
			const router = inject(Router);

			return AuthStateService.useIsAuthorized$().pipe(
				map((isAuthorized) => {
					console.log(isAuthorized);
					if (isAuthorized) {
						router.navigateByUrl('/');
						return false;
					}
					return true;
				})
			);
		};
	}
}
