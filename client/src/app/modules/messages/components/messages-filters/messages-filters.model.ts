import { FormControl } from '@angular/forms';

export interface MessagesFiltersForm {
	Container: FormControl<string>;
}

export interface MessagesFilters {
	Container: string;
}
