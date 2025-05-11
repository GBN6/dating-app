import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginForm } from './login.model';
import { FieldTextComponent } from '../../../shared/controls/field-text/field-text.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormSubmitDirective } from '../../../shared/controls/directives/form-submit.directive';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth-state.service';
import { tap } from 'rxjs';
import { LinkComponent } from '../../../shared/components/link/link.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	imports: [ReactiveFormsModule, FieldTextComponent, ButtonComponent, FormSubmitDirective, LinkComponent],
})
export class LoginComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly authStateService = inject(AuthStateService);
	private readonly router = inject(Router);

	public form: FormGroup<LoginForm> = this.buildForm();

	private buildForm(): FormGroup<LoginForm> {
		return this.fb.group<LoginForm>({
			username: this.fb.control<string>('', { validators: [Validators.required] }),
			password: this.fb.control<string>('', { validators: [Validators.required] }),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;

		const loginPayload = this.form.getRawValue();

		this.authStateService
			.login(loginPayload)
			.pipe(tap(() => this.goBack()))
			.subscribe();
	}

	public goBack(): void {
		this.router.navigate(['/']);
	}
}
