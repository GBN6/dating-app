import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-server-error',
	imports: [],
	templateUrl: './server-error.component.html',
	styleUrl: './server-error.component.scss',
})
export class ServerErrorComponent {
	public error = inject(Router).getCurrentNavigation()?.extras?.state?.['error'];
}
