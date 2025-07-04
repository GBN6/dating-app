import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControlAbstract } from '../form-control.abstract';
import { SelectOption } from './field-select.model';
import { ControlErrorDirective } from '../directives/control-error.directive';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-field-select',
	standalone: true,
	imports: [ControlErrorDirective, ReactiveFormsModule],
	templateUrl: './field-select.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldSelectComponent<T> extends FormControlAbstract<T> {
	public placeholder = input<string>('');
	public options = input<SelectOption<T>[]>([]);
	public valueChange = output<string>();

	public onSelectChange(event: Event) {
		const value = (event.target as HTMLSelectElement).value;
		this.valueChange.emit(value);
	}
}
