import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from '../../../../messages/messages.service';
import { AsyncPipe } from '@angular/common';
import { defer } from 'rxjs';
import { IconComponent } from '../../../../../shared/components/icons/icon.component';
import { TimeagoModule } from 'ngx-timeago';
import { FieldTextComponent } from '../../../../../shared/controls/field-text/field-text.component';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormSubmitDirective } from '../../../../../shared/controls/directives/form-submit.directive';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { JwtService } from '../../../../../core/auth/jwt/jwt.service';

@Component({
	selector: 'app-member-message',
	templateUrl: './member-message.component.html',
	styleUrl: 'member-message.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		AsyncPipe,
		IconComponent,
		TimeagoModule,
		FieldTextComponent,
		ReactiveFormsModule,
		FormSubmitDirective,
		ButtonComponent,
	],
})
export class MemberMessageComponent implements OnInit, OnDestroy {
	public username = input.required<string>();
	private readonly messageService = inject(MessagesService);
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly jwtService = inject(JwtService);

	public messages = this.messageService.messages;

	public form: FormGroup<{ message: FormControl<string> }> = this.buildForm();

	ngOnInit() {
		if (this.jwtService.token) {
			this.messageService.createHubConnection(this.jwtService.token, this.username());
		} else {
			this.messageService.stopHubConnection();
		}
	}

	private buildForm(): FormGroup<{ message: FormControl<string> }> {
		return this.fb.group<{ message: FormControl<string> }>({
			message: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(500)] }),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;

		const updatePayLoad = this.form.getRawValue();
		this.messageService.sendMessage$(this.username(), updatePayLoad.message).subscribe();
	}

	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}
}
