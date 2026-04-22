import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {AuthService} from '../../services/auth/auth-service';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const password2 = control.get('password2')?.value;
    if (!password || !password2) {
      return null;
    }
    return password === password2 ? null : { passwordsMismatch: true };
  };
}

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  protected registerForm : FormGroup;
  private registerService : AuthService = inject(AuthService);
  private router : Router = inject(Router);
  protected isSubmitting : boolean = false;
  protected errorMessage : string = '';



  constructor(private fb: FormBuilder) {
    this.registerForm = fb.group({
      username : new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      email : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      password2 : new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)])
    },
      {validators : passwordsMatchValidator()}
    )
  }

  get username() {
    return this.registerForm.get('username');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get password2() {
    return this.registerForm.get('password2');
  }

  protected onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const username = this.registerForm.value.username;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const password2 = this.registerForm.value.password2;

    this.isSubmitting = true;
    this.errorMessage = '';

    this.registerService.register({username, email, password, password2}).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login'])
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = this.getRegisterErrorMessage(error);
      }
    });
  }

  private getRegisterErrorMessage(error: HttpErrorResponse): string {
    const data = error.error;

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data?.detail) {
      return data.detail;
    }

    if (data && typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      const firstValue = data[firstKey];
      if (Array.isArray(firstValue) && firstValue.length > 0) {
        return String(firstValue[0]);
      }
      if (typeof firstValue === 'string') {
        return firstValue;
      }
      if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return String(data.non_field_errors[0]);
      }
    }

    return 'Registration failed. Please check your data and try again.';
  }
}
