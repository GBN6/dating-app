import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AdminService } from '../../admin.service';
import { PaginatorComponent } from '../../../../shared/paginator/paginator.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { COLUMNS } from './user-managment.const';
import { PaginatorService } from '../../../../shared/paginator/paginator.service';
import { TableCellDirective } from '../../../../shared/paginator/directives/table-cell.directive';
import { MatDialog } from '@angular/material/dialog';
import { UserManagmentDialogComponent } from '../role-manage-dialog/role-manage-dialog.component';
import { filter, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs';
import { UserRoles } from '../../admin.model';
import { Role } from '../../../../core/auth/auth.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-user-managment',
	imports: [MatTabsModule, PaginatorComponent, ButtonComponent, TableCellDirective],
	templateUrl: './user-managment.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [PaginatorService],
})
export class UserManagmentComponent {
	private readonly adminService = inject(AdminService);
	private readonly dialog = inject(MatDialog);
	private readonly paginatorService = inject(PaginatorService);
	private readonly deestroyRef = inject(DestroyRef);

	public readonly columns = COLUMNS;

	get usersRolesRequest() {
		return this.adminService.getUserWithRoles$.bind(this.adminService);
	}

	openDialog(username: string, roles: string[]): void {
		const dialogRef = this.dialog.open(UserManagmentDialogComponent, {
			data: { roles: roles, username: username },
		});

		dialogRef
			.afterClosed()
			.pipe(
				filter(Boolean),
				switchMap((result: { roles: string[] }) => this.adminService.updateUserRoles$(username, result.roles)),
				withLatestFrom(this.paginatorService.getStateSlice$('data')),
				tap(([roleResult, stateData]) => {
					const newStateData = stateData?.map((user: UserRoles) =>
						user.username === username ? { ...user, roles: roleResult } : user
					);
					this.paginatorService.patchState({ data: newStateData });
				}),
				takeUntilDestroyed(this.deestroyRef)
			)
			.subscribe();
	}
}
