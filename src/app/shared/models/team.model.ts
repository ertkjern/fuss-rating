import {UserModel} from './user.model';

export class TeamModel {
  player1: UserModel;
  player2: UserModel;

  rating(): number {
    return Math.round((this.player1.rating + this.player2.rating) / 2);
  }
}
