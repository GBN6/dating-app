import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FieldTextComponent } from '../../../shared/controls/field-text/field-text.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthApiService } from '../auth-api.service';
import { FormSubmitDirective } from '../../../shared/controls/directives/form-submit.directive';
import { RegisterForm } from './register.model';
import { Router } from '@angular/router';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-register',
	templateUrl: 'register.component.html',
	styleUrls: ['./register.component.scss'],
	imports: [ReactiveFormsModule, FieldTextComponent, ButtonComponent, FormSubmitDirective],
})
export class RegisterComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly authService = inject(AuthApiService);
	private readonly router = inject(Router);

	public form: FormGroup<RegisterForm> = this.buildForm();

	private buildForm(): FormGroup<RegisterForm> {
		return this.fb.group<RegisterForm>({
			username: this.fb.control<string>(''),
			email: this.fb.control<string>(''),
			firstName: this.fb.control<string>(''),
			lastName: this.fb.control<string>(''),
			password: this.fb.control<string>(''),
			confirmPassword: this.fb.control<string>(''),
		});
	}

	public handleSubmit(): void {
		this.form.markAllAsTouched();
		const loginPayload = this.form.getRawValue();

		if (this.form.invalid) return;
		this.authService.login(loginPayload).subscribe();
	}

	public goBack(): void {
		this.router.navigate(['/']);
	}
}
