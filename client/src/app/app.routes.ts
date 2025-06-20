import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./core/core.routes').then((m) => m.routes),
	},
	{
		path: '**',
		pathMatch: 'full',
		redirectTo: '',
	},
];
