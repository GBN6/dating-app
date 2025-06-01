import { FormControl } from '@angular/forms';

export interface ListsFiltersForm {
	predicate: FormControl<string>;
}

export interface ListsFilters {
	predicate: string;
}
