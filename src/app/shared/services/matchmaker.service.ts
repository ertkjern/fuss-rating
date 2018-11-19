import {Injectable} from '@angular/core';
import {UserModel} from '../models/user.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatchModel} from '../models/match.model';
import {map} from 'rxjs/operators';
import {HistoryModel} from '../models/history.model';

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
        lastUpdated: new Date(),
        created: new Date().getTime()
      };
      this.afs.collection<MatchModel>('matches').add(match).then( () => {
        this.setIsPlaying(player1, true).then(() => {
          this.setIsPlaying(player2, true).then(() => {
            resolve(true);
          });
        });
      }, () => {
        resolve(false);
      });
    });
  }

  setIsPlaying(player: UserModel, isPlaying: boolean): Promise<void> {
    player.isPlaying = isPlaying;
    return this.afs.collection<UserModel>('users').doc(player.uid).update(player);
  }

  getMatchesByDate() {
    this.matchCollection = this.afs.collection<MatchModel>('matches', ref => {
      return ref.orderBy('created', 'asc');
    });
    return this.matchCollection.snapshotChanges().pipe(
       map(actions => actions.map(a => {
        const data = a.payload.doc.data() as MatchModel;
        const id = a.payload.doc.id;
        return {id, ...data };
      }))
    );
  }

  deleteMatch(match: MatchModel): Promise<boolean> {
    return new Promise(resolve =>  {
      this.setIsPlaying(match.player1, false).then(() => {
        this.setIsPlaying(match.player2, false).then(() => {
          this.afs.collection<MatchModel>('matches').doc(match.id).delete().then(() => {
            resolve(true);
          });
        });
      });
    });
  }

  registerWinner(player1Won: boolean, match: MatchModel): Promise<HistoryModel> {
    return new Promise<HistoryModel>( resolve => {
      const player1OldRating = match.player1.rating;
      const player2OldRating = match.player2.rating;
      const updatedMatch = this.calculateELORating(player1Won, match);
      if (updatedMatch) {
        this.updatePlayerRating(updatedMatch.player1).then(() => {
          this.updatePlayerRating(updatedMatch.player2).then(() => {
            this.updateMatch(match, player1OldRating, player2OldRating, player1Won).then(result => {
              resolve(result);
            });
          });
        });
      } else {
        throw new Error('ELO-rating update failed');
      }
    });
  }

  private updatePlayerRating(player: UserModel): Promise<void> {
    player.isPlaying = false;
    return this.afs.collection<UserModel>('users').doc(player.uid).update(player);
  }

  private updateMatch(match: MatchModel, player1Oldrating: number, player2OldRating: number, player1Won): Promise<HistoryModel> {
    return new Promise<HistoryModel>(resolve => {
      match.lastUpdated = new Date();
      const normalizedMatch: HistoryModel = {
        created: match.created,
        lastUpdated: new Date(),
        player1Username: match.player1.username,
        player1Name: match.player1.name,
        player1Uid: match.player1.uid,
        player1NewRating: match.player1.rating,
        player1OldRating: player1Oldrating,
        player2NewRating: match.player2.rating,
        player2OldRating: player2OldRating,
        player2Uid: match.player2.uid,
        player2Username: match.player2.username,
        player2Name: match.player2.name,
        player1Won: player1Won
      };
      this.afs.collection<HistoryModel>('history').add(normalizedMatch).then(() => {
        resolve(normalizedMatch);
      });
    });

  }

  private calculateELORating(player1Won: boolean, match: MatchModel): MatchModel {
    let winnerRating = 0;
    let looserRating = 0;
    if (player1Won) {
      winnerRating = match.player1.rating;
      looserRating = match.player2.rating;
    } else {
      winnerRating = match.player2.rating;
      looserRating = match.player1.rating;
    }
    if (winnerRating > 0 && looserRating > 0) {
      const rw = Math.pow(10, (winnerRating / 400));
      const rl = Math.pow(10, (looserRating / 400));

      const e1 = rw / (rw + rl);
      const e2 = rl / (rw + rl);

      const eloWinner = winnerRating + 32 * (1 - e1);
      const eloLooser = looserRating + 32 * (0 - e2);

      if (player1Won) {
        match.player1.rating = Math.round(eloWinner);
        match.player2.rating = Math.round(eloLooser);
      } else {
        match.player1.rating = Math.round(eloLooser);
        match.player2.rating = Math.round(eloWinner);
      }
      return match;
    }
    return null;

  }
}
