import { Directive, HostListener, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, tap } from 'rxjs';

@Directive({
	standalone: true,
	selector: 'form[formGroup]',
})
export class FormSubmitDirective {
	public formGroup = input<FormGroup>();

	public readonly formSubmit$ = new Subject<void>();

	@HostListener('submit') listenOnSubmit() {
		this.formGroup()?.markAllAsTouched();
		this.formSubmit$.next();
	}
}
