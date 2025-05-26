import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { VALIDATION_ERRORS } from './error.token';

@Component({
	selector: 'app-error',
	standalone: true,
	templateUrl: './error.component.html',
	styleUrl: './error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
	public error = input<string>('');
	public errorParams = input<Record<string, string> | null>(null);

	public validationErrors = input<Record<string, string>>({});

	private readonly defaultValidationErrors = inject(VALIDATION_ERRORS);

	public errorText = computed(() => {
		const combinedValidationErrors = {
			...this.validationErrors(),
			...this.defaultValidationErrors,
		};
		combinedValidationErrors[this.error()];
		const errorMessage = this.errorParams()
			? combinedValidationErrors[this.error()].replace(/{{(\w+)}}/g, (_, key) => this.errorParams()?.[key] ?? '')
			: combinedValidationErrors[this.error()];
		return errorMessage ?? combinedValidationErrors['default'];
	});
}
