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
