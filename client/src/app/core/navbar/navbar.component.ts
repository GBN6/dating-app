import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IconComponent } from '../../shared/components/icons/icon.component';
import { NAVBAR_CONFIG } from './navbar.const';
import { LinkComponent } from '../../shared/components/link/link.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from "../../shared/components/dialog/dialog.component";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-navbar',
	templateUrl: 'navbar.component.html',
	styleUrls: ['navbar.component.scss'],
	imports: [IconComponent, LinkComponent, ButtonComponent, ModalComponent],
})
export class NavbarComponent {
	public isDialogVisible = signal<boolean>(false);
	public readonly navbarConfig = NAVBAR_CONFIG;

	openDialog() {
		this.isDialogVisible.update((prev) => !prev);
	}
}
