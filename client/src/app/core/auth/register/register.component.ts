import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldTextComponent } from '../../../shared/controls/field-text/field-text.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormSubmitDirective } from '../../../shared/controls/directives/form-submit.directive';
import { RegisterForm } from './register.model';
import { Router } from '@angular/router';
import { defer, startWith, tap } from 'rxjs';
import { emailValidator, passwordValidator, twoControlsMatch } from '../../../shared/vaidators/common.validator';
import { AuthStateService } from '../auth-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectOption } from '../../../shared/controls/field-select/field-select.model';
import { FieldSelectComponent } from '../../../shared/controls/field-select/field-select.component';
import { FieldDateComponent } from '../../../shared/controls/field-date/field-date.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-register',
	templateUrl: 'register.component.html',
	styleUrls: ['./register.component.scss'],
	imports: [
		ReactiveFormsModule,
		FieldTextComponent,
		ButtonComponent,
		FormSubmitDirective,
		FieldSelectComponent,
		FieldDateComponent,
	],
})
export class RegisterComponent implements OnInit {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly authStateService = inject(AuthStateService);
	private readonly router = inject(Router);
	private readonly destroyRef = inject(DestroyRef);

	public readonly genderOptions: SelectOption<string>[] = [
		{
			label: 'male',
			value: 'male',
		},
		{
			label: 'female',
			value: 'female',
		},
	];
	public form: FormGroup<RegisterForm> = this.buildForm();

	public listenPasswordChange$ = defer(() =>
		this.form.controls.password!.valueChanges.pipe(
			startWith(this.form.controls.password!.value),
			tap(() => this.form.controls.confirmPassword!.updateValueAndValidity()),
			takeUntilDestroyed(this.destroyRef)
		)
	);

	ngOnInit(): void {
		this.listenPasswordChange$.subscribe();
	}

	private buildForm(): FormGroup<RegisterForm> {
		return this.fb.group<RegisterForm>({
			username: this.fb.control('', { validators: [Validators.required] }),
			email: this.fb.control('', { validators: [Validators.required, emailValidator] }),
			firstName: this.fb.control('', { validators: [Validators.required, Validators.maxLength(20)] }),
			lastName: this.fb.control('', { validators: [Validators.required, Validators.maxLength(20)] }),
			gender: this.fb.control(null, { validators: [Validators.required] }),
			dateOfBirth: this.fb.control(null, { validators: [Validators.required] }),
			city: this.fb.control('', { validators: [Validators.required, Validators.maxLength(20)] }),
			country: this.fb.control('', { validators: [Validators.required, Validators.maxLength(20)] }),
			password: this.fb.control('', { validators: [Validators.required, passwordValidator] }),
			confirmPassword: this.fb.control('', {
				validators: [Validators.required, twoControlsMatch('password')],
			}),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;
		const { confirmPassword, ...registerData } = this.form.getRawValue();
		console.log(registerData);

		this.authStateService
			.register(registerData)
			.pipe(tap(() => this.goToProfile()))
			.subscribe();
	}

	public readonly maxDate = (() => {
		const date = new Date();
		date.setFullYear(date.getFullYear() - 18);
		return date.toISOString().split('T')[0];
	})();

	public goBack(): void {
		this.router.navigate(['/']);
	}

	public goToProfile(): void {
		this.router.navigate(['/member/edit']);
	}
}
