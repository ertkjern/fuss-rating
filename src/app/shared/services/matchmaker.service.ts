import {Injectable} from '@angular/core';
import {UserModel} from '../models/user.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatchModel} from '../models/match.model';
import {map} from 'rxjs/operators';

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
        this.setIsPlaying(player1).then(() => {
          this.setIsPlaying(player2).then(() => {
            resolve(true;
          });
        });
      }, () => {
        resolve(false);
      });
    });
  }

  setIsPlaying(player: UserModel): Promise<void> {
    player.isPlaying = true;
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

  deleteMatch(matchId: string): Promise<any> {
    return this.afs.collection<MatchModel>('matches').doc(matchId).delete();
  }

  registerWinner(player1Won: boolean, match: MatchModel): Promise<boolean> {
    return new Promise<boolean>( resolve => {
      const updatedMatch = this.calculateELORating(player1Won, match);
      if (updatedMatch) {
        this.updatePlayerRating(updatedMatch.player1).then(() => {
          console.log('player 1 updated');
          this.updatePlayerRating(updatedMatch.player2).then(() => {
            console.log('player 2 updated');
            this.updateMatch(match);
            resolve(true);
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

  private updateMatch(match: MatchModel): Promise<void>{
    return this.afs.collection<MatchModel>('matches').doc(match.id).delete();
  }

  private calculateELORating(player1Won: boolean, match: MatchModel): MatchModel {
    let winnerRating = 0;
    let looserRating = 0;
    if (player1Won) {
      winnerRating = match.player1.rating;
      looserRating = match.player2.rating;
    } else {
      winnerRating = match.player1.rating;
      looserRating = match.player2.rating;
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
        match.player2.rating = Math.round(eloLooser);;
      } else {
        match.player1.rating = Math.round(eloLooser);
        match.player2.rating = Math.round(eloWinner);
      }
      return match;
    }
    return null;

  }
}
