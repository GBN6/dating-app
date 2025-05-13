import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

export function loaderInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	const loaderService = inject(LoaderService);
	const snackBar = inject(MatSnackBar);
	const router = inject(Router);

	const messageDuration = 100000;
	loaderService.setIsLoading(true);

	const errorMessage = {
		400: {
			message: (error: HttpErrorResponse) => {
				return Object.values(error.error.errors).flat;
			},
		},
		401: {
			message: (error: HttpErrorResponse) => 'Unauthorized',
		},
		404: {
			message: (error: HttpErrorResponse) => {
				router.navigateByUrl('/not-found');
				return 'Not Found';
			},
		},
		500: {
			message: (error: HttpErrorResponse) => {
				const navigationExtras: NavigationExtras = { state: { error: error.error } };
				router.navigateByUrl('/server-error', navigationExtras);
				return 'Server Error';
			},
		},
		default: {
			message: (error: HttpErrorResponse) => error.error || error.error?.message || error.message,
		},
	};

	return next(request).pipe(
		catchError((error) => {
			const status = error.status as keyof typeof errorMessage;
			const message = errorMessage[status]?.message(error) ?? errorMessage['default'].message(error);

			snackBar.open(Array.isArray(message) ? message.join(` `) : message, 'X', {
				verticalPosition: 'top',
				duration: messageDuration,
				panelClass: ['snack-bar--error'],
			});
			return EMPTY;
		}),
		finalize(() => {
			loaderService.setIsLoading(false);
		})
	);
}
