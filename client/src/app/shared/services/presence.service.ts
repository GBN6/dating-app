import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { AuthApi } from '../../core/auth/auth.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class PresenceService {
	private snackBar = inject(MatSnackBar);

	private readonly HUBS_URL = environment.HUBS_URL;
	private readonly MESSAGE_DURATION = 1000;

	private readonly _onlineUsers = signal<string[]>([]);

	public onlineUsers = this._onlineUsers.asReadonly()

	private hubConnection?: HubConnection;

	public createHubConnection(token: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(`${this.HUBS_URL}/presence`, {
				accessTokenFactory: () => token,
			})
			.withAutomaticReconnect()
			.build();

		this.hubConnection.start().catch((error) => {
			console.error('Error starting SignalR hub connection:', error);
		});

		this.hubConnection.on('UserIsOnline', (username) => this.snackBarMeesage(`${username} is online`, 'success'));

		this.hubConnection.on('UserIsOffline', (username) =>
			this.snackBarMeesage(`${username} is offline`, 'snack-bar--error')
		);

        this.hubConnection.on('GetOnlineUsers', usernames => this._onlineUsers.set(usernames));
	}

	public stopHubConnection() {
		if (this.hubConnection?.state === HubConnectionState.Connected) {
			this.hubConnection.stop().catch((error) => console.error('Error stopping SignalR hub connection:', error));
		}
	}

	private snackBarMeesage(message: string, panelClass: string) {
		this.snackBar.open(message, 'X', {
			duration: this.MESSAGE_DURATION,
			panelClass: [panelClass],
			verticalPosition: 'top',
		});
	}
}
