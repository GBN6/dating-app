import { animate, query, style, transition, trigger, group } from '@angular/animations';

export const routeTransition = trigger('routeTransition', [
	transition('* => *', [
		query(':enter', [style({ opacity: 0 })], { optional: true }),
		query(':leave', [style({ opacity: 0, position: 'absolute' })], { optional: true }),
		query(':enter', [animate('0.8s', style({ opacity: 1 }))], { optional: true }),
	]),
]);
