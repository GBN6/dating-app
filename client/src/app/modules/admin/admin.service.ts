import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserRoles } from './admin.model';
import { Photo } from '../members/members.model';
import { Page } from '../../shared/paginator/paginator.model';
import { Observable } from 'rxjs';
import { Role } from '../../core/auth/auth.model';
import { HttpWithSnackbarService } from '../../shared/services/http-with-snackbar.service';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	private readonly API_URL = environment.API_URL;
	private http = inject(HttpClient);
	private httpWithSnackbar = inject(HttpWithSnackbarService);

	public getUserWithRoles$(params: HttpParams): Observable<Page<UserRoles>> {
		return this.http.get<Page<UserRoles>>(`${this.API_URL}/admin/users-with-roles`, { params });
	}

	public updateUserRoles$(username: string, roles: string[]): Observable<Role[]> {
		return this.httpWithSnackbar.post<Role[]>(
			`${this.API_URL}/admin/edit-roles/${username}?roles=${roles}`,
			'Roles updated',
			{}
		);
	}

	public getPhotosForApproval$() {
		return this.http.get<Photo[]>(`${this.API_URL}/admin/photos-to-moderate`);
	}

	public approvePhoto$(photoId: number) {
		return this.httpWithSnackbar.post(`${this.API_URL}/admin/approve-photo/${photoId}`, 'Photo aproved', {});
	}

	public rejectPhoto$(photoId: number) {
		return this.httpWithSnackbar.post(`${this.API_URL}/admin/reject-photo/${photoId}`, 'Photo rejected', {});
	}
}
