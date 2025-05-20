import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Member } from './members.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MembersService {
	private readonly httpClient = inject(HttpClient);
	private API_URL = environment.API_URL;

	public getMembers$(): Observable<Member[]> {
		return this.httpClient.get<Member[]>(`${this.API_URL}/users`);
	}

	public getMember$(username: string): Observable<Member> {
		return this.httpClient.get<Member>(`${this.API_URL}/users/${username}`);
	}
}
