import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './core/loader/loader.interceptor';
import { VALIDATION_ERRORS } from './shared/components/error/error.token';
import { validationErrors } from '../data/validation-errors.data';
import { USER_DATA, USER_DATA_VALUE } from './core/auth/auth.tokens';
import { AuthStateService } from './core/auth/auth-state.service';
import { jwtInterceptor } from './core/auth/jwt/jwt.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAnimations(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withInterceptors([loaderInterceptor, jwtInterceptor])),
		provideAppInitializer(() => inject(AuthStateService).initializeAuth()),
		{ provide: VALIDATION_ERRORS, useValue: validationErrors },
		{
			provide: USER_DATA,
			useFactory: () => {
				return inject(AuthStateService).getStateSlice$('userData');
			},
			deps: [AuthStateService],
		},
		{
			provide: USER_DATA_VALUE,
			useFactory: () => {
				return inject(AuthStateService).getUserDataValue();
			},
			deps: [AuthStateService],
		},
	],
};
