import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { Design, Type } from './button.model';
import { NgTemplateOutlet } from '@angular/common';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-button',
	templateUrl: 'button.component.html',
	styleUrls: ['button.component.scss'],
	imports: [NgTemplateOutlet],
})
export class ButtonComponent {
	public design = input<Design>('primary');
	public disabled = input(false);
	public type = input<Type>('button');
	public isDisabledOnRequest = input(false);

	@Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
}
