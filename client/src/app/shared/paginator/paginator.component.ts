import { ChangeDetectionStrategy, Component, inject, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Observable, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Page } from './paginator.model';
import { PaginatorService } from './paginator.service';

@Component({
	selector: 'app-paginator',
	templateUrl: 'paginator.component.html',
	styleUrl: 'paginator.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, MatProgressSpinnerModule, MatPaginatorModule],
})
export class PaginatorComponent<T, F> implements OnInit {
	@Input() request!: (params: HttpParams) => Observable<Page<T>>;
	@Input() itemTemplate!: TemplateRef<any>;
	@Input() emptyText = 'The list is empty.';

	private paginatorService = inject(PaginatorService<T, F>);

	public pageState$ = this.paginatorService.getStateSlice$('pageState');
	public data$ = this.paginatorService.getStateSlice$('data');
	public isLoading$ = this.paginatorService.getStateSlice$('isLoading');

	ngOnInit() {
		this.paginatorService.initializePaginator(this.request);
	}

	public handlePageChange({ pageIndex, pageSize }: PageEvent) {
		this.paginatorService.patchState({
			pageState: {
				...this.paginatorService.getStateSliceValue('pageState'),
				currentPage: pageIndex + 1,
				pageSize: pageSize,
			},
		});
	}
}
