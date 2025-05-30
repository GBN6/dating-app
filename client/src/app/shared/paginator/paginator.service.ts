import { inject, Injectable } from '@angular/core';
import {
	BehaviorSubject,
	combineLatest,
	distinctUntilChanged,
	distinctUntilKeyChanged,
	filter,
	map,
	Observable,
	of,
	switchMap,
	tap,
} from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Page, PaginatorState, RequestParams } from './paginator.model';
import { PaginatorUtils } from './paginator.utils';

@Injectable()
export class PaginatorService<T, F> {
	private location = inject(Location);
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);

	private _initialState = {
		isLoading: false,
		pageState: {
			currentPage: 1,
			pageSize: 5,
			totalPages: null,
			totalCount: null,
		},
		filters: null,
		data: null,
	};

	private _paginatorState$ = new BehaviorSubject<PaginatorState<T, F>>(this._initialState);

	private request!: (params: HttpParams) => Observable<Page<T>>;

	private listenPaginatorChange$ = combineLatest([
		this.getStateSlice$('pageState').pipe(
			distinctUntilChanged(
				(previous, current) =>
					previous.currentPage === current.currentPage && previous.pageSize === current.pageSize
			)
		),
		this.getStateSlice$('filters'),
	]).pipe(
		filter(([pageState]) => Boolean(this.request) && Boolean(pageState)),
		distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)),
		tap(() => this.patchState({ isLoading: true })),
		map(
			([{ currentPage, pageSize }, filters]): RequestParams<F> => ({ pageNumber: currentPage, pageSize, filters })
		),
		tap(({ pageNumber, filters }) => this.updateUrl(pageNumber, filters)),
		switchMap((params) => this.request(PaginatorUtils.generateHttpParams(params))),
		tap(({ data, meta }) => this.patchState({ isLoading: false, data: data, pageState: meta }))
	);

	private updateUrl(page: number, filters: Partial<F> | null): void {
		const segments = this.activatedRoute.snapshot.pathFromRoot
			.flatMap((r) => r.url)
			.map((segment) => segment.path)
			.filter(Boolean);

		const urlTree = this.router.createUrlTree(['/', ...segments], {
			relativeTo: this.activatedRoute,
			queryParams: { ...filters, page },
		});
		this.location.replaceState(urlTree.toString());
	}

	public initializePaginator(request: (params: HttpParams) => Observable<Page<T>>) {
		this.request = request;
		this.listenPaginatorChange$.subscribe();
	}

	public getStateSlice$<K extends keyof PaginatorState<T, F>>(key: K): Observable<PaginatorState<T, F>[K]> {
		return this._paginatorState$.pipe(
			distinctUntilKeyChanged(key),
			map((state: PaginatorState<T, F>) => state[key])
		);
	}

	public patchState(stateSlice: Partial<PaginatorState<T, F>>) {
		this._paginatorState$.next({ ...this._paginatorState$.value, ...stateSlice });
	}

	public getStateSliceValue<K extends keyof PaginatorState<T, F>>(key: K): PaginatorState<T, F>[K] {
		return this._paginatorState$.value[key];
	}

	public resetStateSlice<K extends keyof PaginatorState<T, F>>(key: K): void {
		this._paginatorState$.next({
			...this._paginatorState$.value,
			[key]: this._initialState[key],
		});
	}
}
