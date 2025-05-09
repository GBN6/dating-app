import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from './jwt.service';

export function jwtInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
	const jwtService = inject(JwtService);

	const publicEndpoints = ['account/login', 'account/register'];
	const token = jwtService.token;
	const requestWithToken = request.clone({
		setHeaders: { Authorization: `Bearer ${token}` },
	});

	if (publicEndpoints.some((endpoint) => request.url.includes(endpoint))) return next(request);
	return next(requestWithToken);
}
