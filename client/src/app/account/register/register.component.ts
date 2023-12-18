import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, finalize, map, switchMap, take } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  errors: string[] | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  complexPasswordPattern =
    "(?=^.{6,10}$)(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*s).*$";

  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: [
      '',
      [Validators.required, Validators.email],
      [this.validateEmailNotTaken()],
    ],
    password: [
      '',
      [Validators.required, Validators.pattern(this.complexPasswordPattern)],
    ],
  });

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigateByUrl('/shop'),
      error: (error) => (this.errors = error.errors),
    });
  }

  /**
   * Validates that the email entered in the form control is not already taken.
   * Returns a validator function that can be used in a reactive form.
   * @returns A validator function that checks if the email is taken.
   */
  validateEmailNotTaken() {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(() => {
          return this.accountService.checkEmailExists(control.value).pipe(
            map((res) => (res ? { emailExists: true } : null)),
            finalize(() => control.markAsTouched())
          );
        })
      );
    };
  }
}
