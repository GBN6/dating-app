import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessageComponent } from './components/member/member-message.component';
import { LikesService } from '../../../shared/services/likes.service';

@Component({
	selector: 'app-member-details',
	imports: [
		AsyncPipe,
		MatCardModule,
		ButtonComponent,
		MatTabsModule,
		DatePipe,
		GalleryModule,
		ToGalleryPipe,
		MatProgressSpinnerModule,
		TimeagoModule,
		MemberMessageComponent,
	],
	templateUrl: './member-details.component.html',
	styleUrl: './member-details.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberDetailsComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly likesService = inject(LikesService);

	public hasLiked$ = this.route.data.pipe(
		map(({ member }) => computed(() => this.likesService.likeIds().includes(member.id)))
	);

	public member$?: Observable<Member | null> = this.route.data.pipe(map(({ member }) => member));

	public selectedIndex$: Observable<number> = this.route.queryParams.pipe(map((params) => params['tab'] ?? 0));

	public toggleLike(memberId: number) {
		this.likesService.toggleLike$(memberId).subscribe();
	}
}
