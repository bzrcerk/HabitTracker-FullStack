import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';


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

  constructor(public fb : FormBuilder) {
    this.loginForm = this.fb.group({
      email : ['', [Validators.required, Validators.email]],
      password : ['', Validators.required]
    })
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.isErrorOccurred = true;
      return;
    }

    console.log(`Login data: ${this.loginForm.value}`)
    // auth logic
  }
}
