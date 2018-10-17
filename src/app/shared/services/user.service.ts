import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {UserModel} from '../models/user.model';
import {Observable} from 'rxjs';

@Injectable()
export class UserService {

  private userCollection: AngularFirestoreCollection<UserModel>;

  constructor(private afs: AngularFirestore) {

  }

  getUsersByScore(): Observable<UserModel[]> {
    this.userCollection = this.afs.collection<UserModel>('users', ref => {
      return ref.orderBy('rating', 'desc');
    });
    return this.userCollection.valueChanges();
  }

  getUsersByName() {
    this.userCollection = this.afs.collection<UserModel>('users', ref => {
      return ref.orderBy('name', 'asc');
    });
    return this.userCollection.valueChanges();
  }
}
