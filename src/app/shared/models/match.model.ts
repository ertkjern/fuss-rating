import {UserModel} from './user.model';

export class MatchModel {
  created: any;
  player1: UserModel;
  player2: UserModel;
  winner?: UserModel;
}
