import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-link',
	standalone: true,
	styleUrls: ['link.component.scss'],
	template: `<a [style.font-size.rem]="fontSize()" class="link" [routerLink]="route()">
		{{ label() }}
	</a>`,
	imports: [RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
	public label = input<string>('');
	public route = input<string>('');
	public fontSize = input<number>(1.5);
}
