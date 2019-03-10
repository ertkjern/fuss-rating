import {Injectable} from '@angular/core';
import {UserModel} from '../models/user.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatchModel} from '../models/match.model';
import {map} from 'rxjs/operators';
import {HistoryModel} from '../models/history.model';
import {TeamMatchModel} from '../models/team-match.model';
import {TeamHistoryModel} from '../models/team-history.model';
import {TeamModel} from '../models/team.model';

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
      const team1OldRating = match.team1.rating;
      const team2OldRating = match.team2.rating;
      const updatedMatch = this.calculate2v2ELORating(team1Won, match);
      if (updatedMatch) {
        this.updateTeamRating(updatedMatch.team1).then(() => {
          this.updateTeamRating(updatedMatch.team2).then(() => {
            this.updateTeamMatch(match, team1OldRating, team2OldRating, team1Won)
              .then(result => {
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

  private updateTeamRating(team: TeamModel): Promise<void> {
    team.isPlaying = false;
    return this.afs.collection<UserModel>('teams').doc(team.uid).update(team);
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
                          team1OldRating: number,
                          team2OldRating: number,
                          team1Won: boolean): Promise<TeamHistoryModel> {
    return new Promise<TeamHistoryModel>(resolve => {
      match.lastUpdated = new Date();
      const normalizedMatch: TeamHistoryModel = {
        created: match.created,
        lastUpdated: new Date(),
        team1Uid: match.team1.uid,
        team1Name: match.team1.name,
        team1Player1Name: match.team1.player1Name,
        team1Player2Name: match.team1.player2Name,
        team1OldRating: team1OldRating,
        team1NewRating: match.team1.rating,
        team2Uid: match.team2.uid,
        team2Name: match.team2.name,
        team2Player1Name: match.team2.player1Name,
        team2Player2Name: match.team2.player2Name,
        team2OldRating: team2OldRating,
        team2NewRating: match.team2.rating,
        team1Won: team1Won
      };
      this.afs.collection<TeamHistoryModel>('team-history').add(normalizedMatch).then(() => {
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
    if (match.team1.rating <= 0 || match.team2.rating <= 0) {
      return null;
    }
    if (team1Won) {
      const newRatings = this.calculateELORating(match.team1.rating, match.team2.rating);
      match.team1.rating = newRatings[0];
      match.team2.rating = newRatings[1];
    } else {
      const newRatings = this.calculateELORating(match.team2.rating, match.team1.rating);
      match.team1.rating = newRatings[1];
      match.team2.rating = newRatings[0];
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
