import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoaderService } from '../loader/loader.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-shell',
	standalone: true,
	template: `
		<div class="shell flex flex--column">
			<app-navbar />
			@if (isLoading()) {
				<mat-progress-bar class="progress-bar" mode="indeterminate" value="40"></mat-progress-bar>
			}
			<h1>SHELL COMPONENT</h1>
			<main>
				<router-outlet />
				<ul class="margin-5">
					@for (user of users$ | async; track user.id) {
						<li class="secondary-color-600">{{ user.id }}. {{ user.userName }}</li>
					}
				</ul>
			</main>
		</div>
	`,
	styleUrls: ['shell.component.scss'],
	imports: [CommonModule, RouterOutlet, NavbarComponent, MatProgressBar],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
	private loaderService = inject(LoaderService);
	private readonly httpClient = inject(HttpClient);

	public isLoading = this.loaderService.isLoading;
	public users$: Observable<any[]> = this.httpClient.get<any[]>('https://localhost:5001/api/users'); // Expose the loading state to the template
}
