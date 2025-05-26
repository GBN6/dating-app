export const validationErrors = {
	default: 'The field is filled incorrectly',
	required: 'This field is required',
	response: 'No matching location found',
	maxlength: 'Too many characters',
	emailPattern: 'E-mail is in wrong format.',
	password: 'Password must have letter, number and 8 chars. long.',
	controlsMatch: 'This field must match with {{otherControlName}}',
} satisfies Record<string, string>;
