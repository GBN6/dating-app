import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IconComponent } from '../../shared/components/icons/icon.component';
import { NAVBAR_CONFIG } from './navbar.const';
import { LinkComponent } from '../../shared/components/link/link.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../auth/auth-state.service';
import { AsyncPipe } from '@angular/common';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-navbar',
	templateUrl: 'navbar.component.html',
	styleUrls: ['navbar.component.scss'],
	imports: [IconComponent, LinkComponent, ButtonComponent, AsyncPipe, RouterLink],
})
export class NavbarComponent {
	private router = inject(Router);
	private authService = inject(AuthStateService);
	public isAuthorized$ = AuthStateService.useIsAuthorized$();

	public isDialogVisible = signal<boolean>(false);
	public readonly navbarConfig = NAVBAR_CONFIG;

	public goToLogin(): void {
		this.router.navigate(['/login']);
	}

	public goToRegister(): void {
		this.router.navigate(['/register']);
	}

	public logout(): void {
		this.authService.logout().subscribe();
	}
}
