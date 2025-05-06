import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-home',
	standalone: true,
	templateUrl: 'home.component.html',
	imports: [],
})
export class HomeComponent {}
