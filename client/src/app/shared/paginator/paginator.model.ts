import { TemplateRef } from '@angular/core';

export interface PaginatorState<T, F> {
	isLoading: boolean;
	pageState: PageState;
	filters: F | null;
	data: T[] | null;
}

export interface Page<T> {
	data: T[];
	meta: PageState;
}

export interface PageState {
	currentPage: number;
	pageSize: number;
	totalPages: number | null;
	totalCount: number | null;
}

export interface BaseParams {
	pageSize: number;
	pageNumber: number;
}

export interface RequestParams<F> extends BaseParams {
	filters: F | null;
}

export interface ColumnDef<T = string> {
	name: T;
	content: string;
}

export type CellName<T> = keyof (T & typeof FunctionlColumn);
export type ColumnName<T> = keyof (T & typeof FunctionlColumn);
export type Column<T> = ColumnDef<ColumnName<T>>;
export type Columns<T> = Column<T>[];

export type CellTemplates<T> = { [K in CellName<T>]?: TemplateRef<any> | null };

export const enum FunctionlColumn {
	actions = 'actions',
}
