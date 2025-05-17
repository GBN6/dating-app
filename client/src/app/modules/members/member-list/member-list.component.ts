import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MembersService } from '../members.service';
import { Observable } from 'rxjs';
import { Member } from '../members.model';
import { AsyncPipe } from '@angular/common';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
	selector: 'app-members-list',
	imports: [AsyncPipe, MemberCardComponent],
	templateUrl: './member-list.component.html',
	styleUrl: './member-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersListComponent {
	private readonly membersService = inject(MembersService);
	public members$: Observable<Member[]> = this.membersService.getMembers$();
}
