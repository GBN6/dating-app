import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { HomeComponent } from './home/home.component';
import { authenticated, notAuthenticated } from './auth/auth.guards';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

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
				component: LoginComponent,
				canActivate: [notAuthenticated],
			},
			{
				path: 'register',
				component: RegisterComponent,
				canActivate: [notAuthenticated],
			},
			{
				path: 'members',
				loadComponent: () =>
					import('../modules/members/member-list/member-list.component').then((m) => m.MembersListComponent),
				canActivate: [authenticated],
			},
			{
				path: 'members/:id',
				loadComponent: () =>
					import('../modules/members/member-details/member-details.component').then(
						(m) => m.MemberDetailsComponent
					),
				canActivate: [authenticated],
			},
			{
				path: 'lists',
				loadComponent: () => import('../modules/lists/lists.component').then((m) => m.ListsComponent),

				canActivate: [authenticated],
			},
			{
				path: 'messages',
				loadComponent: () => import('../modules/messages/messages.component').then((m) => m.MessagesComponent),
				canActivate: [authenticated],
			},
			{
				path: '**',
				pathMatch: 'full',
				redirectTo: '',
			},
		],
	},
];
