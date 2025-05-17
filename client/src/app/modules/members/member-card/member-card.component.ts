import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Member } from '../members.model';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { IconComponent } from "../../../shared/components/icons/icon.component";
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-member-card',
	imports: [MatCardModule, ButtonComponent, IconComponent, RouterLink],
	templateUrl: './member-card.component.html',
	styleUrl: './member-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemberCardComponent {
	public member = input.required<Member>();
}
