import { Component, inject } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialog,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { DialogData } from '../../admin.model';
import {
	FormControl,
	FormGroup,
	FormsModule,
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Role } from '../../../../core/auth/auth.model';

@Component({
	selector: 'app-role-manage-dialog',
	templateUrl: './role-manage-dialog.component.html',
	imports: [
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatFormFieldModule,
		MatSelectModule,
		FormsModule,
		ReactiveFormsModule,
		ButtonComponent,
	],
})
export class UserManagmentDialogComponent {
	readonly dialogRef = inject(MatDialogRef<UserManagmentDialogComponent>);
	readonly data = inject<DialogData>(MAT_DIALOG_DATA);
	private readonly fb = inject(NonNullableFormBuilder);

    public readonly roles = [Role.ADMIN, Role.MEMBER, Role.MODERATOR];

	public form: FormGroup<{ roles: FormControl<string[] | null> }> = this.buildForm();

	private buildForm(): FormGroup<{ roles: FormControl<string[] | null> }> {
		return this.fb.group<{ roles: FormControl<string[] | null> }>({
			roles: this.fb.control(this.data?.roles || null, { validators: [Validators.required] }),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;
		const rolesPayload = this.form.getRawValue();
		this.dialogRef.close(rolesPayload);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}
