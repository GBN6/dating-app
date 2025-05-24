import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
	NavigationStart,
	Router,
	RouterOutlet,
	Event,
	NavigationEnd,
	NavigationCancel,
	NavigationError,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoaderService } from '../loader/loader.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
	selector: 'app-shell',
	standalone: true,
	template: `
		<div class="shell flex flex--column">
			<app-navbar />
			@if (isRouteLoading() || isLoading()) {
				<mat-progress-bar class="progress-bar" mode="indeterminate" value="40"></mat-progress-bar>
			}
			<main>
				<router-outlet />
			</main>
			<app-footer class="footer" />
		</div>
	`,
	styleUrls: ['shell.component.scss'],
	imports: [CommonModule, RouterOutlet, NavbarComponent, MatProgressBar, FooterComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
	private readonly loaderService = inject(LoaderService);
	private readonly router = inject(Router);

	public isLoading = this.loaderService.isLoading;
	public isRouteLoading = signal(false);

	constructor() {
		this.router.events.subscribe((event: Event) => {
			if (event instanceof NavigationStart) {
				this.isRouteLoading.set(true);
			} else if (
				event instanceof NavigationEnd ||
				event instanceof NavigationCancel ||
				event instanceof NavigationError
			) {
				this.isRouteLoading.set(false);
			}
		});
	}
}
