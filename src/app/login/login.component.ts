import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '../shared/services/validation.service';
import {LoginModel} from '../shared/models/login.model';
import {AuthenticationService} from '../shared/services/authentication.service';
import {Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-login',
  styleUrls: ['login.component.scss'],
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  loginForm: FormGroup;
  registerUser: FormGroup;
  errorMessage: string;
  showNewUser: boolean;
  isRegistering: boolean;

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
      } else {
        this.isLoading = false;
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
    if (this.loginForm.valid) {
      this.isRegistering = true;
      this.errorMessage = null;
      this.auth.login(loginForm.email, loginForm.password).then(result => {
        if (result && !result.error) {
          this.isRegistering = false;
          this.router.navigate(['home']);
        } else {
          this.isRegistering = false;
          this.errorMessage = result.data.message;
        }
      });
    }
  }

  register(user: any) {
    if (this.registerUser.valid) {
      this.isRegistering = true;

      this.auth.exists(user.username).pipe(
        switchMap(exists => {
          if (exists) {
            return of({error: true, data: {message: 'Username is taken'}});
          }
          return this.auth.register(user.email, user.password, user.username, user.name);
        })
      ).subscribe(result => {
        if (result && !result.error) {
          this.isRegistering = false;
          this.router.navigate(['home']);
        } else {
          this.errorMessage = result.data.message;
          this.isRegistering = false;
        }
      });
    }
  }

  toggleNewUser() {
    this.errorMessage = null;
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
