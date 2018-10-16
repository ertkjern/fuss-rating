import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../shared/services/validation.service';
import {LoginModel} from '../shared/models/login.model';
import {AuthenticationService} from '../shared/services/authentication.service';
import {Router} from '@angular/router';
import {UserModel} from '../shared/models/user.model';

@Component({
  selector: 'app-login',
  styleUrls: ['login.component.scss'],
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  loginForm: FormGroup;
  registerUser: FormGroup;
  loginError: boolean;
  showNewUser: boolean;

  constructor(private fb: FormBuilder, private  validationService: ValidationService, private auth: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.setupForm();
    this.auth.isLoggedIn().subscribe(result => {
      if (result) {
        this.isLoading = false;
        this.router.navigate(['home']);
      }
    });
  }

  private setupForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, this.validationService.emailValidator])],
      password: ['', Validators.required],
    });

    this.registerUser = this.fb.group({
      email: ['', Validators.compose([Validators.required, this.validationService.emailValidator])],
      password: ['', Validators.required],
      username: ['', Validators.required],
      name: ['', Validators.required]
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

  register(user: any) {
    this.auth.register(user.email, user.password, user.username, user.name).then(() => {
      console.log('success');
      this.router.navigate(['home']);
    }, error => {
      console.log(error);
      this.loginError = true;
    });
  }

  toggleNewUser() {
    this.loginError = false;
    this.showNewUser = !this.showNewUser;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get registerEmail() {
    return this.registerUser.get('email');
  }

  get registerPassword() {
    return this.registerUser.get('password');
  }

  get registerUsername() {
    return this.registerUser.get('username');
  }

  get registerName() {
    return this.registerUser.get('name');
  }


}
