import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControlAbstract } from '../form-control.abstract';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlErrorDirective } from '../directives/control-error.directive';

@Component({
	selector: 'app-field-textarea',
	standalone: true,
	imports: [ReactiveFormsModule, ControlErrorDirective],
	templateUrl: './field-textarea.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTextAreaComponent extends FormControlAbstract<string> {
	public placeholder = input<string>('');
	public rows = input<number>(5);
}
