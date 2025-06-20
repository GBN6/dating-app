import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, signal } from '@angular/core';
import { Member, Photo } from '../../../members.model';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../../shared/components/icons/icon.component';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { JwtService } from '../../../../../core/auth/jwt/jwt.service';
import { MatTableModule } from '@angular/material/table';
import { COLUMNS } from './photo-editor.const';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoaderService } from '../../../../../core/loader/loader.service';
import { AuthStateService } from '../../../../../core/auth/auth-state.service';
import { MembersService } from '../../../members.service';
import { tap } from 'rxjs';

@Component({
	selector: 'app-photo-editor',
	imports: [ButtonComponent, IconComponent, FileUploadModule, NgClass, DecimalPipe, MatProgressBar, MatTableModule],
	templateUrl: './photo-editor.component.html',
	styleUrl: './photo-editor.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoEditorComponent {
	private readonly jwtService = inject(JwtService);
	private readonly cdr = inject(ChangeDetectorRef);
	private readonly authStatService = inject(AuthStateService);
	private readonly memberService = inject(MembersService);

	public member = input.required<Member>();

	public uploader?: FileUploader;
	public hasBaseDropZoneOver = signal<boolean>(false);
	public uploadProgress = signal<number>(0);
	public readonly columns = COLUMNS;
	private API_URL = environment.API_URL;

	ngOnInit() {
		this.initializeUploader();
	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver.set(e);
	}

	public deletePhoto(photoId: number) {
		this.memberService
			.deletePhoto(photoId)
			.pipe(
				tap(() => {
					const updatedMember = { ...this.member() };
					updatedMember.photos = updatedMember.photos.filter((photo) => photo.id !== photoId);
					this.authStatService.setUserData(updatedMember);
				})
			)
			.subscribe();
	}

	public setMainPhoto(photo: Photo) {
		this.memberService
			.setMainPhoto(photo.id)
			.pipe(
				tap(() => {
					const updatedMember = { ...this.member() };
					updatedMember.photoUrl = photo.url;
					updatedMember.photos.forEach((currentPhoto) => {
						currentPhoto.isMain = false;
						if (currentPhoto.id === photo.id) currentPhoto.isMain = true;
					});
					this.authStatService.setUserData(updatedMember);
				})
			)
			.subscribe();
	}

	private initializeUploader() {
		this.uploader = new FileUploader({
			url: this.API_URL + '/users/add-photo',
			authToken: 'Bearer ' + this.jwtService.token,
			isHTML5: true,
			allowedFileType: ['image'],
			removeAfterUpload: true,
			autoUpload: false,
			maxFileSize: 10 * 1024 * 1024,
		});

		this.uploader.onAfterAddingFile = (file) => {
			file.withCredentials = false;
			this.cdr.markForCheck();
		};

		this.uploader.onProgressItem = (_, progress: number) => this.uploadProgress.set(progress);

		this.uploader.onSuccessItem = (item, response, status, headers) => {
			const photo: Photo = JSON.parse(response);
			const updatedMember = { ...this.member() };
			updatedMember.photos.push(photo);
			if (photo.isMain) {
				updatedMember.photoUrl = photo.url;
			}
			this.authStatService.setUserData(updatedMember);
		};
	}

	public get uploaderQueue() {
		return this.uploader?.queue ? [...this.uploader.queue] : [];
	}
}
