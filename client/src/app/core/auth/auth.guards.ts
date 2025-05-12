import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthStateService } from './auth-state.service';

export const authenticated: CanActivateFn = (route, state) => {
	const router = inject(Router);

	return AuthStateService.useIsAuthorized$().pipe(
		tap((isAuthorized) => (isAuthorized ? true : router.navigateByUrl('/')))
	);
};

export const notAuthenticated: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const authStateService = inject(AuthStateService);

	if (authStateService.isLoggedIn()) {
		router.navigateByUrl('/');
		return false;
	}
	return true;
};
