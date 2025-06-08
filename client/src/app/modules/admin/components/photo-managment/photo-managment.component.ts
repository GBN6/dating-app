import { Component, OnInit, inject } from '@angular/core';
import { Photo } from '../../../members/members.model';
import { AdminService } from '../../admin.service';
import { tap } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
	selector: 'app-photo-management',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './photo-managment.component.html',
	styleUrl: './photo-managment.component.scss',
})
export class PhotoManagementComponent implements OnInit {
	private readonly adminService = inject(AdminService);

	public photos: Photo[] = [];

	ngOnInit(): void {
		this.getPhotosForApproval$();
	}

	private getPhotosForApproval$() {
		this.adminService
			.getPhotosForApproval$()
			.pipe(tap((result) => (this.photos = result)))
			.subscribe();
	}

	public approvePhoto(photoId: number) {
		this.adminService
			.approvePhoto$(photoId)
			.pipe(
				tap(() =>
					this.photos.splice(
						this.photos.findIndex((p) => p.id === photoId),
						1
					)
				)
			)
			.subscribe();
	}

	public rejectPhoto(photoId: number) {
		this.adminService
			.rejectPhoto$(photoId)
			.pipe(
				tap(() =>
					this.photos.splice(
						this.photos.findIndex((p) => p.id === photoId),
						1
					)
				)
			)
			.subscribe();
	}
}
