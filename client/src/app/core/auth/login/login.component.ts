import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginForm } from './login.model';
import { FieldTextComponent } from '../../../shared/controls/field-text/field-text.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthApiService } from '../auth-api.service';
import { FormSubmitDirective } from '../../../shared/controls/directives/form-submit.directive';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-login',
	templateUrl: './login.component.html',
	imports: [ReactiveFormsModule, FieldTextComponent, ButtonComponent, FormSubmitDirective],
})
export class LoginComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly authService = inject(AuthApiService);

	public form: FormGroup<LoginForm> = this.buildForm();

	private buildForm(): FormGroup<LoginForm> {
		return this.fb.group<LoginForm>({
			username: this.fb.control<string>(''),
			password: this.fb.control<string>(''),
		});
	}

	public handleSubmit(): void {
		this.form.markAllAsTouched();
		const loginPayload = this.form.getRawValue();

		if (this.form.invalid) return;
		this.authService.login(loginPayload).subscribe();
	}
}
