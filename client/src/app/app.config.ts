import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './core/loader/loader.interceptor';
import { VALIDATION_ERRORS } from './shared/components/error/error.token';
import { validationErrors } from '../data/validation-errors.data';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withInterceptors([loaderInterceptor])),
		{ provide: VALIDATION_ERRORS, useValue: validationErrors },
	],
};
