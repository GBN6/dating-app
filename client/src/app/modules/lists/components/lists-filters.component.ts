import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Member } from '../../members/members.model';
import { ListsFilters, ListsFiltersForm } from './lists-filters.model';
import { FormSubmitDirective } from '../../../shared/controls/directives/form-submit.directive';
import { FieldSelectComponent } from '../../../shared/controls/field-select/field-select.component';
import { PaginatorFilterComponent } from '../../../shared/paginator/paginator-filter.component';

@Component({
	selector: 'app-lists-filters',
	template: `<form
		[formGroup]="form"
		(ngSubmit)="filter()"
		class="login-form flex flex--column flex--center gap-1 text-center">
		<app-field-select
			class="margin-bottom-3"
			formControlName="predicate"
			type="select"
			label="Show Members"
			placeholder="Choose which members"
			[options]="sortOpitons"
			(valueChange)="onSortChange($event)" />
	</form>`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, FormSubmitDirective, FieldSelectComponent],
})
export class ListFiltersComponent extends PaginatorFilterComponent<Member, ListsFilters> {
	public readonly sortOpitons = [
		{ value: 'liked', label: 'Liked Members' },
		{ value: 'likedBy', label: 'Members who liked me' },
		{ value: 'mutual', label: 'Mutual Likes' },
	];

	override ngOnInit(): void {
		super.ngOnInit();
		this.filter();
	}

	protected override buildForm(): void {
		this.form = this.fb.group<ListsFiltersForm>({
			predicate: this.fb.control('liked'),
		});
	}

	public onSortChange(value: string) {
		this.filter();
	}
}
