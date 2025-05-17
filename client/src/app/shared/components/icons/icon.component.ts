import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
	selector: 'app-icon',
	standalone: true,
	template: `<span [style.font-size.rem]="size()" class="material-symbols-outlined flex flex--center">{{
		icon()
	}}</span>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
	public icon = input<string>('');
	public size = input<number>(1);
}
