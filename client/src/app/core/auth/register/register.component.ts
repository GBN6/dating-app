import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldTextComponent } from '../../../shared/controls/field-text/field-text.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthApiService } from '../auth-api.service';
import { FormSubmitDirective } from '../../../shared/controls/directives/form-submit.directive';
import { RegisterForm } from './register.model';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { emailValidator, passwordValidator, twoControlsMatch } from '../../../shared/vaidators/common.validator';
import { AuthStateService } from '../auth-state.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-register',
	templateUrl: 'register.component.html',
	styleUrls: ['./register.component.scss'],
	imports: [ReactiveFormsModule, FieldTextComponent, ButtonComponent, FormSubmitDirective],
})
export class RegisterComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly authStateService = inject(AuthStateService);
	private readonly router = inject(Router);

	public form: FormGroup<RegisterForm> = this.buildForm();

	private buildForm(): FormGroup<RegisterForm> {
		return this.fb.group<RegisterForm>({
			username: this.fb.control<string>('', { validators: [Validators.required] }),
			email: this.fb.control<string>('', { validators: [Validators.required, emailValidator] }),
			firstName: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(20)] }),
			lastName: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(20)] }),
			password: this.fb.control<string>('', { validators: [Validators.required, passwordValidator] }),
			confirmPassword: this.fb.control<string>('', {
				validators: [Validators.required, twoControlsMatch('password')],
			}),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;
		const { confirmPassword, ...registerData } = this.form.getRawValue();

		this.authStateService
			.register(registerData)
			.pipe(tap(() => this.goBack()))
			.subscribe();
	}

	public goBack(): void {
		this.router.navigate(['/']);
	}
}
