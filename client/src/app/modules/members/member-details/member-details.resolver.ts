import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Member } from '../members.model';
import { MembersService } from '../members.service';

export const MemberDetailsResolver: ResolveFn<Member> = (route: ActivatedRouteSnapshot) => {
	const membersService = inject(MembersService);

	const username = route.params['username'] as string;

	return membersService.getMember$(username);
};
