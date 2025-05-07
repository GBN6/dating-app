import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';

export function loaderInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
	const loaderService = inject(LoaderService);
	const snackBar = inject(MatSnackBar);

	const messageDuration = 100000;
	loaderService.setIsLoading(true);

	return next(request).pipe(
		catchError((error) => {
			console.log(error);
			const errorMessage = error.error?.message || error.message;

			snackBar.open(Array.isArray(errorMessage) ? errorMessage.join(` `) : errorMessage, 'X', {
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
