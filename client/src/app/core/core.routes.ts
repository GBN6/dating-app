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
                component: HomeComponent
            }
        ],
	},
];
