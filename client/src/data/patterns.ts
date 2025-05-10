export const patterns = {
	email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
	hasAtLeastOneLetter: /[a-zA-Z]/,
	hasAtLeastOneNumber: /[0-9]/,
} satisfies Record<string, RegExp>;
