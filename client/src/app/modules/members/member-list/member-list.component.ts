import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MembersService } from '../members.service';
import { MemberCardComponent } from '../member-card/member-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatorComponent } from '../../../shared/paginator/paginator.component';
import { PaginatorService } from '../../../shared/paginator/paginator.service';
import { MembersListFiltersComponent } from "./components/members-list-filters.component";

@Component({
	selector: 'app-members-list',
	imports: [PaginatorComponent, MatProgressSpinnerModule, MemberCardComponent, MembersListFiltersComponent],
	templateUrl: './member-list.component.html',
	styleUrl: './member-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [PaginatorService],
})
export class MembersListComponent {
	private readonly membersService = inject(MembersService);
	// public members$: Observable<Member[]> = this.membersService.getMembers$(this.pageNumber, this.pageSize);

	get membersRequest() {
		return this.membersService.getMembers$.bind(this.membersService)
	}
}
