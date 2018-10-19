/**
 * Created by AleksanderVatleWaage on 07.02.2017.
 */
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {Router} from '@angular/router';
import {User} from 'firebase';
import {UserModel} from '../models/user.model';
import {AngularFirestore} from '@angular/fire/firestore';


@Injectable()
export class AuthenticationService {

  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;


  constructor(private fb: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user = fb.authState;
  }

  login(email: string, password: string): Promise<any> {
    return new Promise(
      resolve => {
        this.fb.auth.signInWithEmailAndPassword(email, password).then(
          result => {
            resolve(result);
          },
          err => {
            const error = {
              error: true,
              data: err
            };
            resolve(error);
          }
        );
      }
    );
  }

  register(email: string, password: string, username: string, name: string): Promise<any> {
    return new Promise<any>(resolve => {
      this.fb.auth.createUserWithEmailAndPassword(email, password).then(result => {
        const user = {
          email: email,
          username: username,
          name: name,
          uid: result.user.uid,
          rating: 1500
        };
        this.storeUserData(user);
        resolve(result);
      }, err => {
        const error = {
          error: true,
          data: err
        };
        resolve(error);
      });
    });
  }

  storeUserData(user: any) {
    this.afs.collection<UserModel>('users').doc(user.uid).set(user);
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

