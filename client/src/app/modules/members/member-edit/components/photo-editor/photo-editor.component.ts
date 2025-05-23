import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Member } from '../../../members.model';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../../shared/components/icons/icon.component';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { environment } from '../../../../../../environments/environment';
import { JwtService } from '../../../../../core/auth/jwt/jwt.service';

@Component({
	selector: 'app-photo-editor',
	imports: [ButtonComponent, IconComponent, FileUploadModule, NgClass, DecimalPipe, NgStyle],
	templateUrl: './photo-editor.component.html',
	styleUrl: './photo-editor.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoEditorComponent {
	private readonly jwtService = inject(JwtService);

	public member = input.required<Member>();

	public uploader?: FileUploader;
	public hasBaseDropZoneOver = false;
	private API_URL = environment.API_URL;

	ngOnInit() {
		this.initializeUploader();
	}

	public fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	private initializeUploader() {
		this.uploader = new FileUploader({
			url: this.API_URL + 'users/add-photo',
			authToken: 'Bearer ' + this.jwtService.token,
			isHTML5: true,
			allowedFileType: ['image'],
			removeAfterUpload: true,
			autoUpload: false,
			maxFileSize: 10 * 1024 * 1024,
		});

		this.uploader.onAfterAddingFile = (file) => {
			file.withCredentials = false;
		};

		// this.uploader.onSuccessItem = (item, response, status, headers) => {
		// 	const photo = JSON.parse(response);
		// 	const updatedMember = { ...this.member() };
		// 	updatedMember.photos.push(photo);
		// 	this.memberChange.emit(updatedMember);
		// 	if (photo.isMain) {
		// 		const user = this.accountService.currentUser();
		// 		if (user) {
		// 			user.photoUrl = photo.url;
		// 			this.accountService.setCurrentUser(user);
		// 		}
		// 		updatedMember.photoUrl = photo.url;
		// 		updatedMember.photos.forEach((p) => {
		// 			if (p.isMain) p.isMain = false;
		// 			if (p.id === photo.id) p.isMain = true;
		// 		});
		// 		this.memberChange.emit(updatedMember);
		// 	}
		// };
	}
}
