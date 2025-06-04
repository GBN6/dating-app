import { Component, inject } from '@angular/core';
import { MessagesService } from './messages.service';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { MessagesFiltersComponent } from './components/messages-filters/messages-filters.component';
import { PaginatorService } from '../../shared/paginator/paginator.service';
import { MatTableModule } from '@angular/material/table';
import { Columns } from '../../shared/paginator/paginator.model';
import { Message } from './messages.model';
import { TableCellDirective } from '../../shared/paginator/directives/table-cell.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { filter, map, switchMap, tap } from 'rxjs';
import { AsyncPipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';

@Component({
	selector: 'app-messages',
	imports: [
		PaginatorComponent,
		MessagesFiltersComponent,
		MatTableModule,
		ButtonComponent,
		TableCellDirective,
		AsyncPipe,
		TitleCasePipe,
		TimeagoModule,
	],
	templateUrl: './messages.component.html',
	styleUrl: './messages.component.scss',
	providers: [PaginatorService],
})
export class MessagesComponent {
	private readonly messageService = inject(MessagesService);
	private readonly paginatorService = inject(PaginatorService);

	public outbox$ = this.paginatorService.getStateSlice$('filters').pipe(
		filter(Boolean),
		map(({ Container }) => Container === 'Outbox')
	);

	public readonly columns: Columns<Message> = [
		{ name: 'content', content: 'Message' },
		{ name: 'senderUsername', content: 'From / To' },
		{ name: 'dateRead', content: 'Sent / Received' },
		{ name: 'actions', content: 'Actions' },
	];

	get messagesRequest() {
		return this.messageService.getMessages$.bind(this.messageService);
	}

	doSomething(element: any) {
		// Implement your action here
		console.log('Action performed on:', element);
	}

	public deleteMessage(id: number) {
		this.messageService
			.deleteMessage(id)
			.pipe(
				switchMap(() => {
					return this.paginatorService.getStateSlice$('data');
				}),
				tap((data) => {
					const filteredMessages = data?.filter((message) => message.id !== id);
					this.paginatorService.patchState({ data: filteredMessages });
				})
			)
			.subscribe();
	}
}
