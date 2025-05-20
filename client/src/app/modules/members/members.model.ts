export interface Member {
	id: number;
	username: string;
	age: number;
	email: string;
	firstName: string;
	lastName: string;
	photoUrl: string;
	knownAs: string;
	created: Date;
	lastActive: Date;
	gender: string;
	introduction: string;
	interests: string;
	lookingFor: string;
	city: string;
	country: string;
	photos: Photo[];
}

export interface Photo {
	id: number;
	url: string;
	isMain: boolean;
}
