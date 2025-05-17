import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

import { MembersListComponent } from '../../modules/members/member-list/member-list.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-home',
	standalone: true,
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.scss'],
	imports: [ButtonComponent, AsyncPipe],
})
export class HomeComponent {
	private readonly router = inject(Router);
	public isAuthorized$ = AuthStateService.useIsAuthorized$();

	public goToRegister(): void {
		this.router.navigate(['/register']);
	}

	public goToMemebers(): void {
		this.router.navigate(['/members']);
	}
}
