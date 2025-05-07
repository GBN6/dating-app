import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IconComponent } from '../../shared/components/icons/icon.component';
import { NAVBAR_CONFIG } from './navbar.const';
import { LinkComponent } from '../../shared/components/link/link.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-navbar',
	templateUrl: 'navbar.component.html',
	styleUrls: ['navbar.component.scss'],
	imports: [IconComponent, LinkComponent, ButtonComponent],
})
export class NavbarComponent {
	private router = inject(Router);

	public isDialogVisible = signal<boolean>(false);
	public readonly navbarConfig = NAVBAR_CONFIG;

	public goToLogin(): void {
		this.router.navigate(['/login']);
	}

	public goToRegister(): void {
		this.router.navigate(['/register']);
	}
}
