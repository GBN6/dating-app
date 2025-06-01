import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-icon',
	standalone: true,
	template: `<span
		[style.font-size.rem]="size()"
		class="material-symbols-outlined flex flex--center"
		[ngStyle]="{ 'font-variation-settings': getFilledValue() }"
		>{{ icon() }}</span
	>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgStyle],
})
export class IconComponent {
	public icon = input<string>('');
	public size = input<number>(1);
	public filled = input<boolean>(false);

	public getFilledValue() {
		return `'FILL' ${this.filled() ? 1 : 0}`;
	}
}
