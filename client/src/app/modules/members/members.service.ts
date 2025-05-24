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
		return this.httpWithSnackbar
			.put<Member>(`${this.API_URL}/users`, 'Update successful', member)
			.pipe(tap(() => this.updateCachedMembers(member)));
	}

	public setMainPhoto(photoId: number) {
		return this.httpWithSnackbar.put(
			`${this.API_URL}/users/set-main-photo/${photoId}`,
			'Setting main photo successful',
			{}
		);
	}

	public deletePhoto(photoId: number) {
		return this.httpWithSnackbar.delete(
			`${this.API_URL}/users/delete-photo/${photoId}`,
			'Deleting photo successful'
		);
	}

	public updateCachedMembers(member: Partial<Member>): void {
		this._members.update((cachedMembers) =>
			cachedMembers.map((cachedMember) =>
				cachedMember.username === member.username ? { ...cachedMember, ...member } : cachedMember
			)
		);
	}
}
