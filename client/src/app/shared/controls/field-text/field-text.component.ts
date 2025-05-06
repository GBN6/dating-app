import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlErrorDirective } from '../directives/control-error.directive';
import { FormControlAbstract } from '../form-control.abstract';

@Component({
	selector: 'app-field-text',
	imports: [ReactiveFormsModule, ControlErrorDirective],
	templateUrl: './field-text.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldTextComponent extends FormControlAbstract<string> {
	public placeholder = input<string>('');
	public type = input<string>('text');
}
