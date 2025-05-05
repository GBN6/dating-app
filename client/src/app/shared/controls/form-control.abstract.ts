import { Directive, OnInit, input } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Directive()
export abstract class FormControlAbstract<T> implements ControlValueAccessor, OnInit {
	public static nextId = 0;

	static generateControlId() {
		return `control-${FormControlAbstract.nextId++}`;
	}

	public label = input<string>('');
	public validationErrors = input<Record<string, string>>({});

	public formControl!: FormControl<T>;
	public id = FormControlAbstract.generateControlId();
	private _value!: T;
	private _disabled = false;

	private onChange: any = (value: T) => {};
	private onTouch: any = () => {};

	constructor(private ngControl: NgControl) {
		ngControl.valueAccessor = this;
	}

	ngOnInit(): void {
		this.formControl = this.ngControl.control as FormControl<T>;
	}

	public writeValue(value: T): void {
		this._value = value;
		this.onChange(value);
	}

	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this.onTouch = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this._disabled = isDisabled;
	}
}
