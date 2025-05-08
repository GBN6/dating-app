import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from './auth.model';

export const USER_DATA = new InjectionToken<Observable<UserData>>('USER_DATA');
export const USER_DATA_VALUE = new InjectionToken<UserData>('USER_DATA_VALUE');
