import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaginatorService } from './paginator.service';

@Component({ template: '' })
export abstract class PaginatorFilterComponent<T, F> implements OnInit {
	public form!: FormGroup;

	private paginatorService = inject(PaginatorService<T, F>);
	protected fb = inject(NonNullableFormBuilder);
	private activatedRoute = inject(ActivatedRoute);

	ngOnInit() {
		this.buildForm();
		this.initializeFilters();
	}

	protected abstract buildForm(): void;

	private initializeFilters() {
		const { queryParams } = this.activatedRoute.snapshot;

		this.form.patchValue(queryParams);
	}

	public filter() {
		this.paginatorService.patchState({ filters: this.form.value });
	}

	public clearFilters() {
		this.form.reset();
		this.paginatorService.resetStateSlice('filters');
	}
}
