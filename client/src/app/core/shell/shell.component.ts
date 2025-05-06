import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-shell',
	standalone: true,
	template: `
		<div class="shell flex flex--column">
			<app-navbar />
			<h1>SHELL COMPONENT</h1>
			<main>
				<router-outlet />
			</main>
		</div>
	`,
	styleUrls: ['shell.component.scss'],
	imports: [CommonModule, RouterOutlet, NavbarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
