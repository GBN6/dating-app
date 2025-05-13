import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-home',
	standalone: true,
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss'],
	imports: [ButtonComponent, AsyncPipe, UpperCasePipe],
})
export class HomeComponent {
	private readonly router = inject(Router);
	private readonly httpClient = inject(HttpClient);

	public isAuthorized$ = AuthStateService.useIsAuthorized$();

	public users$: Observable<any[]> = this.httpClient.get<any[]>('https://localhost:5001/api/users'); // Expose the loading state to the template

	public goToRegister(): void {
		this.router.navigate(['/register']);
	}

	get500Error() {
		this.httpClient.get('https://localhost:5001/api/buggy/server-error').subscribe({
			next: (response) => console.log(response),
			error: (error) => console.log(error),
		});
	}
}
