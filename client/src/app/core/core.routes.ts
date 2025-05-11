import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { HomeComponent } from './home/home.component';
import { AuthGuards } from './auth/auth.guards';

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
				canActivate: [AuthGuards.notAuthenticated()],
			},
			{
				path: 'register',
				loadComponent: () => import('./auth/register/register.component').then((m) => m.RegisterComponent),
				canActivate: [AuthGuards.notAuthenticated()],
			},
			{
				path: 'members',
				loadComponent: () =>
					import('../modules/members/member-list/member-list.component').then((m) => m.MembersListComponent),
				canActivate: [AuthGuards.authenticated()],
			},
			{
				path: 'members/:id',
				loadComponent: () =>
					import('../modules/members/member-details/member-details.component').then(
						(m) => m.MemberDetailsComponent
					),
				canActivate: [AuthGuards.authenticated()],
			},
			{
				path: 'lists',
				loadComponent: () => import('../modules/lists/lists.component').then((m) => m.ListsComponent),

				canActivate: [AuthGuards.authenticated()],
			},
			{
				path: 'messages',
				loadComponent: () => import('../modules/messages/messages.component').then((m) => m.MessagesComponent),
				canActivate: [AuthGuards.authenticated()],
			},
		],
	},
];
