import {Injectable} from '@angular/core';
import {UserModel} from '../models/user.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatchModel} from '../models/match.model';
import {map, switchMap} from 'rxjs/operators';
import {HistoryModel} from '../models/history.model';
import {TeamMatchModel} from '../models/team-match.model';
import {combineLatest, Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {TeamHistoryModel} from '../models/team-history.model';

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
      this.afs.collection<MatchModel>('matches').add(match).then(() => {
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
        return {id, ...data};
      }))
    );
  }

  deleteMatch(match: MatchModel): Promise<boolean> {
    return new Promise(resolve => {
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
    return new Promise<HistoryModel>(resolve => {
      const player1OldRating = match.player1.rating;
      const player2OldRating = match.player2.rating;
      const updatedMatch = this.calculate1v1ELORating(player1Won, match);
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

  // TODO fix
  registerWinnerTeam(team1Won: boolean, match: TeamMatchModel): Promise<TeamHistoryModel> {
    return new Promise<TeamHistoryModel>(resolve => {
      const player1OldRating = match.team1.player1.rating;
      const player2OldRating = match.team1.player2.rating;
      const player3OldRating = match.team2.player1.rating;
      const player4OldRating = match.team2.player2.rating;
      const updatedMatch = this.calculate2v2ELORating(team1Won, match);
      if (updatedMatch) {
        this.updatePlayerRating(updatedMatch.team1.player1).then(() => {
          this.updatePlayerRating(updatedMatch.team1.player2).then(() => {
            this.updatePlayerRating(updatedMatch.team2.player1).then(() => {
              this.updatePlayerRating(updatedMatch.team2.player2).then(() => {
                this.updateTeamMatch(match, player1OldRating, player2OldRating, player3OldRating, player4OldRating, team1Won)
                  .then(result => {
                    resolve(result);
                  });
              });
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

  private updateTeamMatch(match: TeamMatchModel,
                          player1OldRating: number,
                          player2OldRating: number,
                          player3OldRating: number,
                          player4OldRating: number,
                          team1Won: boolean): Promise<TeamHistoryModel> {
    return new Promise<TeamHistoryModel>(resolve => {
      match.lastUpdated = new Date();
      const normalizedMatch: TeamHistoryModel = {
        created: match.created,
        lastUpdated: new Date(),
        player1Username: match.team1.player1.username,
        player1Name: match.team1.player1.name,
        player1Uid: match.team1.player1.uid,
        player1NewRating: match.team1.player1.rating,
        player1OldRating: player1OldRating,
        player2NewRating: match.team1.player2.rating,
        player2OldRating: player2OldRating,
        player2Uid: match.team1.player2.uid,
        player2Username: match.team1.player2.username,
        player2Name: match.team1.player2.name,
        player3NewRating: match.team1.player2.rating,
        player3OldRating: player3OldRating,
        player3Uid: match.team2.player1.uid,
        player3Username: match.team2.player1.username,
        player3Name: match.team2.player1.name,
        player4NewRating: match.team2.player2.rating,
        player4OldRating: player4OldRating,
        player4Uid: match.team2.player2.uid,
        player4Username: match.team2.player2.username,
        player4Name: match.team2.player2.name,
        team1Won: team1Won
      };
      this.afs.collection<TeamHistoryModel>('history').add(normalizedMatch).then(() => {
        resolve(normalizedMatch);
      });
    });
  }

  private calculate1v1ELORating(player1Won: boolean, match: MatchModel): MatchModel {
    if (match.player1.rating <= 0 || match.player2.rating <= 0) {
      return null;
    }
    if (player1Won) {
      const newRatings = this.calculateELORating(match.player1.rating, match.player2.rating);
      match.player1.rating = newRatings[0];
      match.player2.rating = newRatings[1];
    } else {
      const newRatings = this.calculateELORating(match.player2.rating, match.player1.rating);
      match.player1.rating = newRatings[1];
      match.player2.rating = newRatings[0];
    }
    return match;
  }


  private calculate2v2ELORating(team1Won: boolean, match: TeamMatchModel): TeamMatchModel {
    if (match.team1.player1.rating <= 0 || match.team1.player2.rating <= 0
      || match.team2.player1.rating <= 0 || match.team2.player2.rating <= 0) {
      return null;
    }
    const oldTeam1Rating = match.team1.rating();
    const oldTeam2Rating = match.team2.rating();
    if (team1Won) {
      const newTeamRatings = this.calculateELORating(oldTeam1Rating, oldTeam2Rating);
      const ratingChangeTeam1 = newTeamRatings[0] - oldTeam1Rating;
      const ratingChangeTeam2 = newTeamRatings[1] - oldTeam1Rating;
      match.team1.player1.rating = match.team1.player1.rating + ratingChangeTeam1;
      match.team1.player2.rating += ratingChangeTeam1;
      match.team2.player1.rating += ratingChangeTeam2;
      match.team2.player2.rating += ratingChangeTeam2;
    } else {
      const newTeamRatings = this.calculateELORating(oldTeam2Rating, oldTeam1Rating);
      match.team2.player1.rating += newTeamRatings[0] - oldTeam1Rating;
      match.team2.player2.rating += newTeamRatings[0] - oldTeam1Rating;
      match.team1.player1.rating += newTeamRatings[1] - oldTeam2Rating;
      match.team1.player2.rating += newTeamRatings[1] - oldTeam2Rating;
    }
    return match;
  }

  private calculateELORating(winnerRating: number, loserRating: number): [number, number] {
    if (winnerRating > 0 && loserRating > 0) {
      const rw = Math.pow(10, (winnerRating / 400));
      const rl = Math.pow(10, (loserRating / 400));

      const e1 = rw / (rw + rl);
      const e2 = rl / (rw + rl);

      const eloWinner = winnerRating + 20 * (1 - e1);
      const eloloser = loserRating + 20 * (0 - e2);

      return [Math.round(eloWinner), Math.round(eloloser)];
    }
    return [0, 0];
  }
}
