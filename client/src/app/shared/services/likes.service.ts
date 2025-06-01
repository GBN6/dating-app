import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Page } from '../paginator/paginator.model';
import { Member } from '../../modules/members/members.model';

@Injectable({
	providedIn: 'root',
})
export class LikesService {
	private http = inject(HttpClient);
	private API_URL = environment.API_URL;
	private _likeIds = signal<number[]>([]);
	public likeIds = this._likeIds.asReadonly();

	public toggleLike$(targetId: number): Observable<void> {
		return this.http.post<void>(`${this.API_URL}/likes/${targetId}`, {}).pipe(
			tap(() => {
				if (this._likeIds().includes(targetId)) {
					this._likeIds.update((ids) => ids.filter((x) => x !== targetId));
				} else {
					this._likeIds.update((ids) => [...ids, targetId]);
				}
			})
		);
	}

	public getLikes$(params: HttpParams): Observable<Page<Member>> {
		return this.http.get<Page<Member>>(`${this.API_URL}/likes`, { params });
	}

	public getLikeIds$(): Observable<number[]> {
		return this.http.get<number[]>(`${this.API_URL}/likes/list`).pipe(tap((likes) => this._likeIds.set(likes)));
	}
	// public hasLiked(id: number): Signal<boolean> {
	// 	return computed(() => this._likeIds().includes(id));
	// }
}
