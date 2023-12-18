import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-inputs.component.html',
  styleUrls: ['./text-inputs.component.scss'],
})
export class TextInputsComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() label = '';

  /**
   * Constructs a new instance of the TextInputComponent.
   * @param controlDir - The NgControl instance for the component.
   */
  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this; // Sets the value accessor for the component.
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}

  /**
   * Gets the FormControl instance associated with the control directive.
   *
   * @returns The FormControl instance.
   */
  get control(): FormControl {
    return this.controlDir.control as FormControl;
  }
}
