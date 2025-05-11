import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
	selector: 'app-link',
	standalone: true,
	styleUrls: ['link.component.scss'],
	template: `<a
		[style.font-size.rem]="fontSize()"
		class="link"
		[routerLink]="route()"
		routerLinkActive="link__active">
		{{ label() }}
	</a>`,
	imports: [RouterLink, RouterLinkActive],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
	public label = input<string>('');
	public route = input<string>('');
	public fontSize = input<number>(1.5);
}
