/**
 * Created by AleksanderVatleWaage on 07.02.2017.
 */
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {Router} from '@angular/router';


@Injectable()
export class AuthenticationService {

  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;


  constructor(private fb: AngularFireAuth, private router: Router) {
    this.user = fb.authState;
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise(
      resolve => {
        this.fb.auth.signInWithEmailAndPassword(email, password).then(
          () => {
            resolve(true);
          },
          () => {
            resolve(false);
          }
        );
      }
    );
  }

  logout() {
    this.fb.auth.signOut();
    this.router.navigate(['login']);
  }

  resetPassword(email: string) {
    return new Promise(
      resolve => {
        this.fb.auth.sendPasswordResetEmail(email).then(
          () => {
            resolve(true);
          },
          () => {
            resolve(false);
          }
        );
      }
    );
  }

  isLoggedIn(): Observable<firebase.User> {
    return this.user;
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise(
      resolve => {
        this.fb.authState.subscribe(result => {
          if (result && result.uid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
    );
  }


}

