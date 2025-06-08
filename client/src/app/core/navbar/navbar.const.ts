import { Role } from '../auth/auth.model';

export const NAVBAR_CONFIG: { label: string; route: string; role: Role[] }[] = [
	{ label: 'Matches', route: '/members', role: [Role.ADMIN, Role.MEMBER] },
	{ label: 'Lists', route: '/lists', role: [Role.ADMIN, Role.MEMBER] },
	{ label: 'Messages', route: '/messages', role: [Role.ADMIN, Role.MEMBER] },
	{ label: 'Admin', route: '/admin', role: [Role.ADMIN, Role.MODERATOR] },
];
