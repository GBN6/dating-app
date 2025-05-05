import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { IconComponent } from '../icons/icon.component';

@Component({
	standalone: true,
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrl: './dialog.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [IconComponent],
})
export class ModalComponent {
	@Output() closeEvent = new EventEmitter<null>();

	handleClose() {
		this.closeEvent.emit();
	}
}
