import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MembersService } from '../members/members.service';
import { ListFiltersComponent } from './components/lists-filters.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { PaginatorService } from '../../shared/paginator/paginator.service';
import { LikesService } from '../../shared/services/likes.service';

@Component({
	selector: 'app-lists',
	imports: [ListFiltersComponent, PaginatorComponent, MemberCardComponent],
	templateUrl: './lists.component.html',
	styleUrl: './lists.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [PaginatorService],
})
export class ListsComponent {
	private readonly likesService = inject(LikesService);
	// public members$: Observable<Member[]> = this.membersService.getMembers$(this.pageNumber, this.pageSize);

	get membersRequest() {
		return this.likesService.getLikes$.bind(this.likesService);
	}
}
