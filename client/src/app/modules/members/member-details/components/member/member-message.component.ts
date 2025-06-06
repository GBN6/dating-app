import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MessagesService } from '../../../../messages/messages.service';
import { AsyncPipe } from '@angular/common';
import { defer } from 'rxjs';
import { IconComponent } from '../../../../../shared/components/icons/icon.component';
import { TimeagoModule } from 'ngx-timeago';
import { FieldTextComponent } from '../../../../../shared/controls/field-text/field-text.component';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormSubmitDirective } from '../../../../../shared/controls/directives/form-submit.directive';
import { ButtonComponent } from "../../../../../shared/components/button/button.component";

@Component({
	selector: 'app-member-message',
	templateUrl: './member-message.component.html',
	styleUrl: 'member-message.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [AsyncPipe, IconComponent, TimeagoModule, FieldTextComponent, ReactiveFormsModule, FormSubmitDirective, ButtonComponent],
})
export class MemberMessageComponent {
	public username = input.required<string>();
	private readonly messageService = inject(MessagesService);
	private readonly fb = inject(NonNullableFormBuilder);

	public getMessageThread$ = defer(() => this.messageService.getMessageThread$(this.username()));

	public form: FormGroup<any> = this.buildForm();

	private buildForm(): FormGroup<any> {
		return this.fb.group<any>({
			message: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(500)] }),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;

		const updatePayLoad = this.form.getRawValue();
		// this.memberService
		// 	.updateMember$(updatePayLoad)
		// 	.pipe(
		// 		tap(() => {
		// 			const newUserData = { ...this.authStatService.getUserDataValue(), ...updatePayLoad } as UserData;
		// 			this.authStatService.setUserData(newUserData);
		// 			this.form.markAsPristine();
		// 		})
		// 	)
		// 	.subscribe();
	}
}
