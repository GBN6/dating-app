import {
	ComponentRef,
	DestroyRef,
	Directive,
	HostListener,
	inject,
	input,
	OnInit,
	ViewContainerRef,
} from '@angular/core';
import { ErrorComponent } from '../../components/error/error.component';
import { FormControlDirective, FormControlStatus, ValidationErrors } from '@angular/forms';
import {
	combineLatest,
	defer,
	distinctUntilChanged,
	filter,
	merge,
	of,
	startWith,
	Subject,
	switchMap,
	tap,
} from 'rxjs';
import { FormSubmitDirective } from './form-submit.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
	standalone: true,
	selector: '[formControl]',
})
export class ControlErrorDirective implements OnInit {
	public validationErrors = input<Record<string, string>>({});

	private erorrComponent!: ComponentRef<ErrorComponent>;

	private readonly formSubmitDirective = inject(FormSubmitDirective);
	private readonly control = inject(FormControlDirective);
	private readonly viewContainerRef = inject(ViewContainerRef);
	private readonly destroyRef = inject(DestroyRef);

	private initializeErrorState$ = new Subject<void>();

	@HostListener('blur') listenOnBlur() {
		this.initializeErrorState$.next();
	}

	private listenFormSubmit$ = defer(() =>
		this.formSubmitDirective.formSubmit$.pipe(tap(() => this.initializeErrorState$.next()))
	);

	private listenControlStatusChange$ = defer(() =>
		combineLatest([
			this.control.valueChanges!.pipe(startWith(this.control.value)),
			this.initializeErrorState$,
		]).pipe(
			filter(() => Boolean(this.control.touched)),
			switchMap(() => of(this.control.errors)),
			distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
			tap((errors) => this.updateErrorMessage(errors))
		)
	);

	ngOnInit(): void {
		this.initErrorComponent();
		merge(this.listenFormSubmit$, this.listenControlStatusChange$)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe();
	}

	private initErrorComponent() {
		this.erorrComponent = this.viewContainerRef.createComponent(ErrorComponent);
		this.erorrComponent.setInput('validationErrors', this.validationErrors);
	}

	private updateErrorMessage(error: ValidationErrors | null) {
		this.erorrComponent.setInput('error', Boolean(error) ? this.getFirstErrorMessage() : '');
		this.erorrComponent.setInput('errorParams', Boolean(error) ? this.getFirstErrorMessageParams() : null);

	}

	private getFirstErrorMessage(): string {
		const errors = this.control.errors;

		if (errors === null) {
			return '';
		}
		return Object.keys(errors)[0];
	}

	private getFirstErrorMessageParams(): Record<string, string> | null {
		const errors = this.control.errors;

		if (errors === null) {
			return null;
		}
		const firstErrorValue = Object.values(errors)[0];
		const firstErrorKey = Object.keys(firstErrorValue)[0];
		if (typeof firstErrorValue[firstErrorKey] === 'boolean') return null;
		return firstErrorValue;
	}
}
