import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { UserManagmentComponent } from './components/user-managment/user-managment.component';
import { PhotoManagementComponent } from './components/photo-managment/photo-managment.component';
import { AuthStateService } from '../../core/auth/auth-state.service';
import { Role } from '../../core/auth/auth.model';

@Component({
	selector: 'app-admin',
	imports: [MatTabsModule, UserManagmentComponent, PhotoManagementComponent],
	templateUrl: './admin.component.html',
	styleUrl: './admin.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
	private readonly authStateService = inject(AuthStateService);

	public isAdmin = computed(() => this.authStateService.roles()?.includes(Role.ADMIN));
}
