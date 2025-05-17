import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MembersService } from '../members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../members.model';
import { Observable, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
	selector: 'app-member-details',
	imports: [AsyncPipe, MatCardModule, ButtonComponent, MatTabsModule],
	templateUrl: './member-details.component.html',
	styleUrl: './member-details.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailsComponent {
	private readonly membersService = inject(MembersService);
	private readonly route = inject(ActivatedRoute);

	public member$?: Observable<Member> = this.route.params.pipe(
		switchMap((params) => this.membersService.getMember$(params['username']))
	);
}
