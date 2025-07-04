import { FormControl } from '@angular/forms';

export interface MembersFiltersForm {
	gender: FormControl<string>;
	minAge: FormControl<number | null>;
	maxAge: FormControl<number | null>;
	orderBy: FormControl<string | null>;
}

export interface MembersFilters {
	gender: string;
	minAge: number;
	maxAge: number;
	orderBy: string;
}
