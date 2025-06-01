import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Member } from '../members.model';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icons/icon.component';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../shared/services/likes.service';

@Component({
	selector: 'app-member-card',
	imports: [MatCardModule, ButtonComponent, IconComponent, RouterLink],
	templateUrl: './member-card.component.html',
	styleUrl: './member-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberCardComponent {
	public member = input.required<Member>();
	private readonly likesService = inject(LikesService);

	public hasLiked = computed(() => this.likesService.likeIds().includes(this.member().id));

	public toggleLike() {
		this.likesService.toggleLike$(this.member().id).subscribe();
	}
}
