import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {ValidationService} from '../../shared/services/validation.service';

@Component({
  selector: 'app-forgot-password',
  styleUrls: ['forgot-password.component.scss'],
  templateUrl: 'forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  error: string;
  passwordReset: boolean;

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private validationService: ValidationService) {
  }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, this.validationService.emailValidator])],
    });
  }

  resetPassword(value: any) {
    this.auth.resetPassword(value.email).then(() => {
      this.passwordReset = true;
    }, error => {
      console.log(error);
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
