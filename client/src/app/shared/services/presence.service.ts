import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, tap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	private snackBar = inject(MatSnackBar);
	private router = inject(Router);

	private readonly HUBS_URL = environment.HUBS_URL;
	private readonly MESSAGE_DURATION = 3000;

	private readonly _onlineUsers = signal<string[]>([]);

	public onlineUsers = this._onlineUsers.asReadonly();

	private hubConnection?: HubConnection;

	public createHubConnection(token: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(`${this.HUBS_URL}/presence`, {
				accessTokenFactory: () => token,
			})
			.configureLogging(LogLevel.None)
			.withAutomaticReconnect()
			.build();

		this.hubConnection.start().catch((error) => {
			console.error('Error starting SignalR hub connection:', error);
		});

		this.hubConnection.on('UserIsOnline', (username) => this._onlineUsers.update((users) => [...users, username]));

		this.hubConnection.on('UserIsOffline', (username) =>
			this._onlineUsers.update((users) => users.filter((user) => user !== username))
		);

		this.hubConnection.on('GetOnlineUsers', (usernames) => this._onlineUsers.set(usernames));

		this.hubConnection.on('NewMessageReceived', ({ knownAs }) =>
			this.getSnackBar(`${knownAs} has sent you a new message!`)
		);
	}

	public stopHubConnection() {
		if (this.hubConnection?.state === HubConnectionState.Connected) {
			this.hubConnection.stop().catch((error) => console.error('Error stopping SignalR hub connection:', error));
		}
	}

	private getSnackBar(message: string) {
		return this.snackBar.open(message, 'X', {
			duration: this.MESSAGE_DURATION,
			panelClass: ['success'],
			verticalPosition: 'top',
		});
	}
}
