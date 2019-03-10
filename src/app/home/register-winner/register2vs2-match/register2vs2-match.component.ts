import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import {MatchmakerService} from '../../../shared/services/matchmaker.service';
import {TeamService} from '../../../shared/services/team.service';
import {TeamModel} from '../../../shared/models/team.model';
import {TeamHistoryModel} from '../../../shared/models/team-history.model';
import {switchMap} from 'rxjs/operators';
import {TeamMatchModel} from '../../../shared/models/team-match.model';

@Component({
  selector: 'app-register2vs2-match',
  templateUrl: './register2vs2-match.component.html',
  styleUrls: ['./register2vs2-match.component.scss']
})
export class Register2vs2MatchComponent implements OnInit {
  teams: TeamModel[];
  team1: TeamModel;
  team2: TeamModel;
  matchResult: TeamHistoryModel;
  isLoading: boolean;
  hasRegistered: boolean;

  constructor(private teamService: TeamService, private auth: AuthenticationService, private matchmaker: MatchmakerService) {
  }

  private static createMatch(team1: TeamModel, team2: TeamModel): TeamMatchModel {
    return {
      team1: team1,
      team2: team2,
      lastUpdated: new Date(),
      created: new Date().getTime()
    } as TeamMatchModel;
  }

  ngOnInit() {
    this.loadTeams();
  }

  private loadTeams() {
    this.auth.isLoggedIn().pipe(
      switchMap(() => this.teamService.getTeamsByName())
    ).subscribe(result => {
      this.teams = result;
    }, err => {
      console.log(err);
    });
  }

  registerWinner() {
    if (!(this.team1 && this.team2)) {
      return;
    } else if (!confirm('Did ' + this.team1.name + ' win?')) {
      console.log('Cancel');
      return;
    }
    this.isLoading = true;
    const matchModel: TeamMatchModel = Register2vs2MatchComponent.createMatch(this.team1, this.team2);
    this.matchmaker.registerWinnerTeam(true, matchModel).then(result => {
      this.isLoading = false;
      if (result) {
        this.matchResult = result;
        this.hasRegistered = true;
      }
    });
  }

  registerNewMatch() {
    this.hasRegistered = false;
  }
}
