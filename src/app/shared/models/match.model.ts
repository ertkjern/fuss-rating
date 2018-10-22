import {UserModel} from './user.model';

export class MatchModel {
  id?: string;
  created: any;
  lastUpdated: any;
  player1: UserModel;
  player2: UserModel;
  winner?: UserModel;
}
