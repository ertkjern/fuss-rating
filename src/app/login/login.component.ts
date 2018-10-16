import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../shared/services/validation.service';
import {LoginModel} from '../shared/models/login.model';
import {AuthenticationService} from '../shared/services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  styleUrls: ['login.component.scss'],
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginError: boolean;

  constructor(private fb: FormBuilder, private  validationService: ValidationService, private auth: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, this.validationService.emailValidator])],
      password: ['', Validators.required],
    });
  }

  login(loginForm: LoginModel) {
    this.loginError = false;
    this.auth.login(loginForm.email, loginForm.password).then(result => {
      if (result) {
        this.router.navigate(['home']);
      } else {
        this.loginError = true;
      }
    });
  }

  get email() { return this.loginForm.get('email'); }

  get password() { return this.loginForm.get('password'); }
}
