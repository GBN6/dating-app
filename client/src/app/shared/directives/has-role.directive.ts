import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthStateService } from '../../core/auth/auth-state.service';

@Directive({
	selector: '[appHasRole]',
	standalone: true,
})
export class HasRoleDirective implements OnInit {
	@Input() appHasRole: string[] | null = [];

	private readonly authStateService = inject(AuthStateService);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly templateRef = inject(TemplateRef);

	ngOnInit(): void {
		if (this.authStateService.roles()?.some((role) => this.appHasRole?.includes(role))) {
			this.viewContainerRef.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainerRef.clear();
		}
	}
}
