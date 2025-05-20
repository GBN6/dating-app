import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MembersService } from '../members.service';
import { Observable } from 'rxjs';
import { Member } from '../members.model';
import { AsyncPipe } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';
import { LoaderService } from '../../../core/loader/loader.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-members-list',
	imports: [AsyncPipe, MemberCardComponent, MatProgressSpinnerModule],
	templateUrl: './member-list.component.html',
	styleUrl: './member-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembersListComponent {
	private readonly loaderService = inject(LoaderService);
	private readonly membersService = inject(MembersService);
	public members$: Observable<Member[]> = this.membersService.getMembers$();

	public isLoading = this.loaderService.isLoading;
}
