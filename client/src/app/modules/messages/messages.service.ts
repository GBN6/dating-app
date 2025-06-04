import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpWithSnackbarService } from '../../shared/services/http-with-snackbar.service';
import { Observable } from 'rxjs';
import { Page } from '../../shared/paginator/paginator.model';
import { Message } from './messages.model';

@Injectable({
	providedIn: 'root',
})
export class MessagesService {
	private readonly httpClient = inject(HttpClient);
	private httpWithSnackbar = inject(HttpWithSnackbarService);

	private API_URL = environment.API_URL;

	public getMessages$(params: HttpParams): Observable<Page<Message>> {
		return this.httpClient.get<Page<Message>>(`${this.API_URL}/messages`, { params });
	}

	public deleteMessage(id: number) {
		return this.httpWithSnackbar.delete(`${this.API_URL}/messages/${id}`, 'Message deleted successfully');
	}
}
