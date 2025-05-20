import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { USER_DATA } from '../../../core/auth/auth.tokens';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormSubmitDirective } from '../../../shared/controls/directives/form-submit.directive';
import { FieldTextComponent } from '../../../shared/controls/field-text/field-text.component';
import { FieldTextAreaComponent } from '../../../shared/controls/field-textarea/field-textarea.component';
import { tap } from 'rxjs';

@Component({
	selector: 'app-member-edit',
	imports: [
		AsyncPipe,
		MatCardModule,
		ButtonComponent,
		MatTabsModule,
		DatePipe,
		ReactiveFormsModule,
		FormSubmitDirective,
		FieldTextComponent,
		FieldTextAreaComponent,
	],
	templateUrl: './member-edit.component.html',
	styleUrl: './member-edit.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberEditComponent {
	public member$ = inject(USER_DATA).pipe(tap((user) => this.form.patchValue(user)));
	private readonly fb = inject(NonNullableFormBuilder);

	public form: FormGroup<any> = this.buildForm();

	private buildForm(): FormGroup<any> {
		return this.fb.group<any>({
			introduction: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(500)] }),
			lookingFor: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(500)] }),
			interests: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(500)] }),
			city: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(20)] }),
			country: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(20)] }),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;

		const updatePayLoad = this.form.getRawValue();
		console.log(updatePayLoad);
		this.form.markAsPristine();
	}
}
