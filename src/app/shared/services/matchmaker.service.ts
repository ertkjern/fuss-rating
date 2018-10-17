import {Injectable} from '@angular/core';
import {UserModel} from '../models/user.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatchModel} from '../models/match.model';

@Injectable()
export class MatchmakerService {

  private matchCollection: AngularFirestoreCollection<MatchModel>;

  constructor(private afs: AngularFirestore) {
  }

  createMatch(player1: UserModel, player2: UserModel) {
    return new Promise(resolve => {
      const match: MatchModel = {
        player1: player1,
        player2: player2,
        created: new Date().getTime()
      };
      this.afs.collection<MatchModel>('matches').add(match).then( () => {
        resolve(true);
      }, () => {
        resolve(false);
      });
    });
  }

  getMatchesByDate() {
    this.matchCollection = this.afs.collection<MatchModel>('matches', ref => {
      return ref.orderBy('created', 'asc');
    });
    return this.matchCollection.valueChanges();
  }
}
