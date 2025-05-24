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
import { map, switchMap, tap } from 'rxjs';
import { MembersService } from '../members.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhotoEditorComponent } from './components/photo-editor/photo-editor.component';
import { AuthStateService } from '../../../core/auth/auth-state.service';
import { MemberEditControls } from './member-edit.model';
import { UserData } from '../../../core/auth/auth.model';

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
		MatProgressSpinnerModule,
		PhotoEditorComponent,
	],
	templateUrl: './member-edit.component.html',
	styleUrl: './member-edit.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberEditComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly memberService = inject(MembersService);
	private readonly authStatService = inject(AuthStateService);

	public member$ = this.authStatService.userData$.pipe(
		map(({ userData }) => userData),
		tap((user) => {
			if (user) {
				this.form.patchValue(user);
			}
		})
	);

	public form: FormGroup<MemberEditControls> = this.buildForm();

	private buildForm(): FormGroup<MemberEditControls> {
		return this.fb.group<MemberEditControls>({
			introduction: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(500)] }),
			lookingFor: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(500)] }),
			interests: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(500)] }),
			city: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(20)] }),
			country: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(20)] }),
			username: this.fb.control<string>(''),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;

		const updatePayLoad = this.form.getRawValue();
		this.memberService
			.updateMember$(updatePayLoad)
			.pipe(
				tap(() => {
					const newUserData = { ...this.authStatService.getUserDataValue(), ...updatePayLoad } as UserData;
					this.authStatService.setUserData(newUserData);
					this.form.markAsPristine();
				})
			)
			.subscribe();
	}
}
