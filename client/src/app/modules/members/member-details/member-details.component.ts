import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MembersService } from '../members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../members.model';
import { map, Observable, switchMap, tap } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { GalleryModule } from 'ng-gallery';
import { ToGalleryPipe } from './member-details.pipe';

@Component({
	selector: 'app-member-details',
	imports: [AsyncPipe, MatCardModule, ButtonComponent, MatTabsModule, DatePipe, GalleryModule, ToGalleryPipe],
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

	public selectedIndex$: Observable<number> = this.route.queryParams.pipe(map((params) => params['tab'] ?? 0));
}
