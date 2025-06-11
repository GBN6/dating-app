import {
	AfterViewChecked,
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { MessagesService } from '../../../../messages/messages.service';
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
		IconComponent,
		TimeagoModule,
		FieldTextComponent,
		ReactiveFormsModule,
		FormSubmitDirective,
		ButtonComponent,
	],
})
export class MemberMessageComponent implements OnInit, AfterViewChecked, OnDestroy {
	public username = input.required<string>();

	@ViewChild('scrollMe') scrollContainer?: any;

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
			message: this.fb.control<string>('', { validators: [Validators.maxLength(500)] }),
		});
	}

	public handleSubmit(): void {
		if (this.form.invalid) return;

		const updatePayLoad = this.form.getRawValue();
		this.messageService.sendMessage(this.username(), updatePayLoad.message).then(() => this.form.reset());
	}

	ngAfterViewChecked(): void {
		this.scrollToBottom();
	}

	private scrollToBottom() {
		if (this.scrollContainer) {
			this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
		}
	}

	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}
}
