import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {AuthService} from '../../services/auth/auth-service';
import {Router, RouterLink} from '@angular/router';
import {validate} from '@angular/forms/signals';
import {NgClass} from '@angular/common';

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
      password : new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      password2 : new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)])
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
    const username = this.registerForm.value.username;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const password2 = this.registerForm.value.password2;

    this.isSubmitting = true;

    this.registerService.register({username, email, password, password2}).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login'])
      },
      error: error => {
        this.isSubmitting = false;
        this.errorMessage = "Something went wrong. Please try again later";
      }
    });
  }
}
