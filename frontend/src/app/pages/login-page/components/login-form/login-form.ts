import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../services/auth/auth-service';


@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  loginForm: FormGroup;
  submitted : boolean = false;
  isErrorOccurred : boolean = false;
  showPassword : boolean = false;
  private authService : AuthService = inject(AuthService);
  private router : Router = inject(Router);

  constructor(public fb : FormBuilder) {
    this.loginForm = this.fb.group({
      username : ['', [Validators.required]],
      password : ['', Validators.required]
    })
  }


  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.isErrorOccurred = true;
      return;
    }

    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/todo']);
        },
      error: () => {
        console.log('Error occurred');
        this.isErrorOccurred = true;
      }
      }
    )
  }
}
