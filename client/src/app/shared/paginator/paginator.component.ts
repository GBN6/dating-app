import {
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	inject,
	Input,
	OnInit,
	QueryList,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Observable, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { CellName, CellTemplates, Column, ColumnName, Columns, FunctionlColumn, Page } from './paginator.model';
import { PaginatorService } from './paginator.service';
import { MatTableModule } from '@angular/material/table';
import { TableCellDirective } from './directives/table-cell.directive';
import { ButtonComponent } from '../components/button/button.component';

@Component({
	selector: 'app-paginator',
	templateUrl: 'paginator.component.html',
	styleUrl: 'paginator.component.scss',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, MatProgressSpinnerModule, MatPaginatorModule, MatTableModule, ButtonComponent],
})
export class PaginatorComponent<T, F> implements OnInit {
	@Input() request!: (params: HttpParams) => Observable<Page<T>>;
	@Input() itemTemplate!: TemplateRef<any>;
	@Input() emptyText = 'The list is empty.';
	@Input() isTable = false;
	@Input() tableColumns: Columns<T> = [];

	@ContentChildren(TableCellDirective) cellTemplateQueryList!: QueryList<TableCellDirective>;
	@ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

	private paginatorService = inject(PaginatorService<T, F>);

	public pageState$ = this.paginatorService.getStateSlice$('pageState');
	public data$ = this.paginatorService.getStateSlice$('data');
	public isLoading$ = this.paginatorService.getStateSlice$('isLoading');

	public cellTemplates: CellTemplates<T> = {};
	public columnNames: ColumnName<T>[] = [];
	public contentColumns: Columns<T> = [];
	public colActions?: Column<T>;

	ngOnInit() {
		this.paginatorService.initializePaginator(this.request);
		this.updateColumns();
		console.log(this.contentColumns);
		console.log(this.tableColumns);
	}

	ngAfterContentInit() {
		this.initCellTemplates();
		console.log(this.cellTemplates.actions);
	}

	public handlePageChange({ pageIndex, pageSize }: PageEvent): void {
		this.paginatorService.patchState({
			pageState: {
				...this.paginatorService.getStateSliceValue('pageState'),
				currentPage: pageIndex + 1,
				pageSize: pageSize,
			},
		});
	}

	private updateColumns(): void {
		this.columnNames = this.tableColumns.map((column) => column.name);
		this.colActions = this.tableColumns.find((column) => column.name === FunctionlColumn.actions);
		console.log('xd ?');
		this.contentColumns = this.tableColumns.filter((column) => column.name !== FunctionlColumn.actions);
	}

	private initCellTemplates(): void {
		this.contentColumns.forEach((column) => {
			this.cellTemplates[column.name] = this.getCellTemplate(column.name);
		});
		this.cellTemplates.actions = this.getCellTemplate(FunctionlColumn.actions);
	}

	private getCellTemplate(column: string | CellName<T>): TemplateRef<any> | null {
		const cellTemplate = this.cellTemplateQueryList.find((template) => template.column === column);

		return cellTemplate ? cellTemplate.templateRef : null;
	}
}
