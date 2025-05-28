import { HttpParams } from '@angular/common/http';
import { RequestParams } from './paginator.model';

export class PaginatorUtils {
	public static generateHttpParams<F>(requestParams: RequestParams<F>): HttpParams {
		const { filters, ...baseParams } = requestParams;

		let params = new HttpParams({ fromObject: baseParams });

		for (const filter in filters) {
			if (filters[filter]) {
				params = params.set(filter, filters[filter].toString());
			}
		}

		return params;
	}
}
