export interface Message {
	id: number;
	senderId: number;
	senderUsername: string;
	senderPhotoUrl: string;
	recipientId: number;
	recipientUsername: string;
	recipientPhotoUrl: string;
	content: string;
	dateRead: Date | null;
	messageSent: string;
}

export interface Group {
	name: string;
	connections: Connection[];
}

export interface Connection {
	connectionId: string;
	username: string
}
