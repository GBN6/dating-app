import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PaginatorFilterComponent } from '../../../../shared/paginator/paginator-filter.component';
import { Member } from '../../members.model';
import { MembersFilters, MembersFiltersForm } from './members-list-filters.model';
import { AuthStateService } from '../../../../core/auth/auth-state.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSubmitDirective } from '../../../../shared/controls/directives/form-submit.directive';
import { FieldSelectComponent } from '../../../../shared/controls/field-select/field-select.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FieldTextComponent } from '../../../../shared/controls/field-text/field-text.component';

@Component({
	selector: 'app-members-list-filters',
	templateUrl: 'members-list-filters.component.html',
	styleUrl: 'members-list-filters.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ReactiveFormsModule, FormSubmitDirective, FieldSelectComponent, ButtonComponent, FieldTextComponent],
})
export class MembersListFiltersComponent extends PaginatorFilterComponent<Member, MembersFilters> {
	private readonly currentUserGender = inject(AuthStateService).getUserDataValue()?.gender;

	public readonly genderOptions = [
		{ value: 'male', label: 'male' },
		{ value: 'female', label: 'female' },
	];

	override ngOnInit(): void {
		super.ngOnInit();
		this.filter();
	}

	protected override buildForm(): void {
		this.form = this.fb.group<MembersFiltersForm>({
			gender: this.fb.control<string>(this.setGenderFilter()),
			minAge: this.fb.control(null),
			maxAge: this.fb.control(null),
		});
	}

	private setGenderFilter(): string {
		return this.currentUserGender === 'male' ? 'female' : 'male';
	}
}
