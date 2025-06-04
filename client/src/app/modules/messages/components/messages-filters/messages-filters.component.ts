import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSubmitDirective } from '../../../../shared/controls/directives/form-submit.directive';
import { FieldSelectComponent } from '../../../../shared/controls/field-select/field-select.component';
import { PaginatorFilterComponent } from '../../../../shared/paginator/paginator-filter.component';
import { Message } from '../../messages.model';
import { MessagesFilters, MessagesFiltersForm } from './messages-filters.model';

@Component({
	selector: 'app-messages-filters',
	template: `<form
		[formGroup]="form"
		(ngSubmit)="filter()"
		class="login-form flex flex--column flex--center gap-1 text-center">
		<app-field-select
			class="margin-bottom-3"
			formControlName="Container"
			type="select"
			label="Show messages"
			placeholder="Choose which messages"
			[options]="sortOpitons"
			(valueChange)="onSortChange($event)" />
	</form>`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, FormSubmitDirective, FieldSelectComponent],
})
export class MessagesFiltersComponent extends PaginatorFilterComponent<Message, MessagesFilters> {
	public readonly sortOpitons = [
		{ value: 'unread', label: 'Unread' },
		{ value: 'Inbox', label: 'Inbox' },
		{ value: 'Outbox', label: 'Outbox' },
	];

	override ngOnInit(): void {
		super.ngOnInit();
		this.filter();
	}

	protected override buildForm(): void {
		this.form = this.fb.group<MessagesFiltersForm>({
			Container: this.fb.control('unread'),
		});
	}

	public onSortChange(value: string) {
		this.filter();
	}
}
