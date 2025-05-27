import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControlAbstract } from '../form-control.abstract';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlErrorDirective } from '../directives/control-error.directive';

@Component({
	selector: 'app-field-date',
	standalone: true,
	imports: [ReactiveFormsModule, ControlErrorDirective],
	templateUrl: './field-date.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldDateComponent extends FormControlAbstract<string> {
	public placeholder = input<string>('');
	public maxDate = input<string>('');
}
