import { Pipe, PipeTransform } from '@angular/core';
import { Photo } from '../members.model';
import { ImageItem } from 'ng-gallery';

@Pipe({
	name: 'toGallery',
	standalone: true,
})
export class ToGalleryPipe implements PipeTransform {
	transform(photos: Photo[]) {
		return photos.map((photo) => new ImageItem({ src: photo.url, thumb: photo.url }));
	}
}
