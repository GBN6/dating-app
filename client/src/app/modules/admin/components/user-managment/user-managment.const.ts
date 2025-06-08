import { Columns } from '../../../../shared/paginator/paginator.model';
import { UserRoles } from '../../admin.model';

export const COLUMNS: Columns<UserRoles> = [
	{ name: 'username', content: 'Username' },
	{ name: 'roles', content: 'Active roles' },
	{ name: 'actions', content: 'Actions' },
];
