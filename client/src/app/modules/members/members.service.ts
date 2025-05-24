import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Member } from './members.model';
import { Observable, of, tap } from 'rxjs';
import { HttpWithSnackbarService } from '../../shared/services/http-with-snackbar.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class MembersService {
	private readonly httpClient = inject(HttpClient);
	private httpWithSnackbar = inject(HttpWithSnackbarService);
	private _members = signal<Member[]>([]);

	private API_URL = environment.API_URL;

	public getMembers$(): Observable<Member[]> {
		if (this._members().length) return toObservable(this._members);
		return this.httpClient.get<Member[]>(`${this.API_URL}/users`).pipe(tap((value) => this._members.set(value)));
	}

	public getMember$(username: string): Observable<Member> {
		const user = this._members().find((member) => member.username === username);
		console.log(user);
		if (user) return of(user);
		return this.httpClient.get<Member>(`${this.API_URL}/users/${username}`);
	}

	public updateMember$(member: Partial<Member>): Observable<Member> {
		return this.httpWithSnackbar.put<Member>(`${this.API_URL}/users`, 'Update successful', member).pipe(
			tap(() => {
				this._members.update((members) =>
					members.map((m) => (m.username === member.username ? { ...m, ...member } : m))
				);
			})
		);
	}
}
