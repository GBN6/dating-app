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
import { FormControlDirective, FormControlStatus } from '@angular/forms';
import { combineLatest, defer, distinctUntilChanged, filter, merge, startWith, Subject, tap } from 'rxjs';
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
			this.control.statusChanges!.pipe(startWith(this.control.status)),
			this.initializeErrorState$,
		]).pipe(
			filter(() => Boolean(this.control.touched)),
			distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
			tap(([status]) => this.updateErrorMessage(status))
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

	private updateErrorMessage(status: FormControlStatus) {
		this.erorrComponent.setInput('error', status === 'INVALID' ? this.getFirstErrorMessage() : '');
	}

	private getFirstErrorMessage(): string {
		const errors = this.control.errors;

		if (errors === null) {
			return '';
		}

		return Object.keys(errors)[0];
	}
}
