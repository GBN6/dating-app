import { FormControl } from '@angular/forms';

export interface RegisterForm {
	username: FormControl<string>;
	email: FormControl<string>;
	firstName: FormControl<string>;
	lastName: FormControl<string>;
	gender: FormControl<string | null>;
	dateOfBirth: FormControl<Date | null>;
	city: FormControl<string>;
	country: FormControl<string>;
	password: FormControl<string>;
	confirmPassword: FormControl<string>;
}
