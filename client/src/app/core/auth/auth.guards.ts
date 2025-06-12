import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { inject } from '@angular/core';
import { AuthStateService } from './auth-state.service';
import { Role } from './auth.model';

export const authenticated: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const authStateService = inject(AuthStateService);

	return authStateService.isLoggedIn() ? true : router.navigateByUrl('/');
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

export const isAdmin: CanActivateFn = (route, state) => {
	const authStateService = inject(AuthStateService);

	if (authStateService.roles()?.includes(Role.ADMIN) || authStateService.roles()?.includes(Role.MODERATOR)) {
		return true;
	}
	return false;
};
