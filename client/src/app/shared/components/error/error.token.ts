import { InjectionToken } from '@angular/core';

export const VALIDATION_ERRORS = new InjectionToken<Record<string, string>>(
  'VALIDATION_ERRROS',
);
