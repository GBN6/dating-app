import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoaderService } from '../loader/loader.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FooterComponent } from '../footer/footer.component';

@Component({
	selector: 'app-shell',
	standalone: true,
	template: `
		<div class="shell flex flex--column">
			<app-navbar />
			@if (isLoading() || isRouteLoading()) {
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
	private readonly httpClient = inject(HttpClient);
	// private router = inject(Router);
	// private destroyRef = inject(DestroyRef);

	public isLoading = this.loaderService.isLoading;
	public isRouteLoading = signal(false);

	// constructor() {
	// 	this.checkRoutChange();
	// }

	// private checkRoutChange() {
	// 	this.router.events
	// 		.pipe(
	// 			tap((event) => {
	// 				if (event instanceof NavigationStart) this.isRouteLoading.set(true);
	// 				this.isRouteLoading.set(false);
	// 			}),
	// 			takeUntilDestroyed(this.destroyRef)
	// 		)
	// 		.subscribe();
	// }
}
