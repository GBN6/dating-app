import { FormControl } from '@angular/forms';

export interface MemberEditControls {
	introduction: FormControl<string>;
	lookingFor: FormControl<string>;
	interests: FormControl<string>;
	city: FormControl<string>;
	country: FormControl<string>;
	username: FormControl<string>;
}
