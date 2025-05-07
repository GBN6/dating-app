import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
	{
		path: '',
		component: ShellComponent,
		children: [
			{
				path: '',
				component: HomeComponent,
			},
			{
				path: 'login',
				loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
			},
			{
				path: 'register',
				loadComponent: () => import('./auth/register/register.component').then((m) => m.RegisterComponent),
			},
		],
	},
];
