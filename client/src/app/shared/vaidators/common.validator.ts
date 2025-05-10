import { AbstractControl, ValidationErrors } from '@angular/forms';
import { patterns } from '../../../data/patterns';

export function emailValidator(control: AbstractControl): ValidationErrors | null {
	const value = control.value as string;

	if (!value) {
		return null;
	}

	return !patterns.email.test(value) ? { emailPattern: true } : null;
}

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
	const value = control.value as string;
	const passwordLength = 8;

	const isLongEnough = value.length >= passwordLength;
	const hasLetter = patterns.hasAtLeastOneLetter.test(value);
	const hasNumber = patterns.hasAtLeastOneNumber.test(value);

	const isValid = isLongEnough && hasNumber && hasLetter;

	return isValid ? null : { password: true };
}
