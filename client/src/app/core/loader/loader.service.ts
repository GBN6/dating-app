import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LoaderService {
	private readonly state = {
		isLoading: signal<boolean>(false),
	};

	public readonly isLoading = this.state.isLoading.asReadonly();

	setIsLoading(isLoading: boolean): void {
		this.state.isLoading.set(isLoading);
	}
}
