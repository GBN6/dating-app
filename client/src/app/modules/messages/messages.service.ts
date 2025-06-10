import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpWithSnackbarService } from '../../shared/services/http-with-snackbar.service';
import { Observable } from 'rxjs';
import { Page } from '../../shared/paginator/paginator.model';
import { Message } from './messages.model';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { UserData } from '../../core/auth/auth.model';

@Injectable({
	providedIn: 'root',
})
export class MessagesService {
	private readonly httpClient = inject(HttpClient);
	private httpWithSnackbar = inject(HttpWithSnackbarService);

	private readonly API_URL = environment.API_URL;
	private readonly HUBS_URL = environment.HUBS_URL;

	private hubConnection?: HubConnection;

	private readonly _messages = signal<Message[]>([]);

	public messages = this._messages.asReadonly();

	public createHubConnection(token: string, otherUserName: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(`${this.HUBS_URL}/message?user=${otherUserName}`, {
				accessTokenFactory: () => token,
			})
			.withAutomaticReconnect()
			.build();

		this.hubConnection.start().catch((error) => {
			console.error('Error starting SignalR hub connection:', error);
		});

		this.hubConnection.on('ReceiveMessageThread', (messages) => {
			this._messages.set(messages);
		});

		this.hubConnection.on('NewMessage', (message) => this._messages.update((messages) => [...messages, message]));
	}

	public stopHubConnection() {
		if (this.hubConnection?.state === HubConnectionState.Connected) {
			this.hubConnection.stop().catch((error) => console.error('Error stopping SignalR hub connection:', error));
		}
	}

	public getMessages$(params: HttpParams): Observable<Page<Message>> {
		return this.httpClient.get<Page<Message>>(`${this.API_URL}/messages`, { params });
	}

	public deleteMessage$(id: number) {
		return this.httpWithSnackbar.delete(`${this.API_URL}/messages/${id}`, 'Message deleted successfully');
	}

	public getMessageThread$(username: string) {
		return this.httpClient.get<Message[]>(`${this.API_URL}/messages/thread/${username}`);
	}

	public async sendMessage(username: string, content: string): Promise<any> {
		return this.hubConnection?.invoke('SendMessage', { recipientUsername: username, content });
	}
}
