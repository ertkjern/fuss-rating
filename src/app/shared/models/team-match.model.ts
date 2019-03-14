import {TeamModel} from './team.model';

export class TeamMatchModel {
  id?: string;
  created: any;
  lastUpdated: any;
  team1: TeamModel;
  team2: TeamModel;
  winner?: TeamModel;
}
