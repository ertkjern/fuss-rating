import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import {MatchmakerService} from '../../../shared/services/matchmaker.service';
import {TeamService} from '../../../shared/services/team.service';
import {TeamModel} from '../../../shared/models/team.model';
import {TeamHistoryModel} from '../../../shared/models/team-history.model';
import {filter, switchMap} from 'rxjs/operators';
import {TeamMatchModel} from '../../../shared/models/team-match.model';
import {UserModel} from '../../../shared/models/user.model';
import {UserService} from '../../../shared/services/user.service';
import {uniqueNamesGenerator} from 'unique-names-generator';
import {combineLatest, Observable} from 'rxjs';

@Component({
  selector: 'app-register2vs2-match',
  templateUrl: './register2vs2-match.component.html',
  styleUrls: ['./register2vs2-match.component.scss']
})
export class Register2vs2MatchComponent implements OnInit {
  users: UserModel[];
  players: UserModel[] = new Array(4);
  teams: TeamModel[];
  matchResult: TeamHistoryModel;
  isLoading: boolean;
  hasRegistered: boolean;

  constructor(private userService: UserService,
              private teamService: TeamService,
              private auth: AuthenticationService,
              private matchmaker: MatchmakerService,
  ) {
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
    this.loadUsers();
  }

  private loadUsers() {
    this.userService.getUsersByName().subscribe(result => {
      this.users = result;
    }, error => {
      console.log(error);
    });
  }

  private allPlayersHaveValue() {
    return this.players.length === 4 && this.players.every(p => p !== null && typeof p !== 'undefined');
  }

  playersWithout(player: UserModel): UserModel[] {
    return this.players.filter(p => p !== player);
  }

  registerWinner() {
    if (this.allPlayersHaveValue()) {
      return;
    } else if (!confirm('Did ' + this.players[0].name + ' & ' + this.players[1].name + ' win?')) {
      console.log('Cancel');
      return;
    }
    this.isLoading = true;

    const team1$ = this.getOrRegisterTeam(this.players[0], this.players[1]);
    const team2$ = this.getOrRegisterTeam(this.players[0], this.players[1]);
    combineLatest(team1$, team2$).pipe(
      switchMap(([team1, team2]) => {
        const match = Register2vs2MatchComponent.createMatch(team1, team2);
        return this.matchmaker.registerWinnerTeam(true, match);
      })
    ).subscribe(result => {
      this.isLoading = false;
      if (result) {
        this.matchResult = result;
        this.hasRegistered = true;
      }
    });
  }

  getOrRegisterTeam(player1: UserModel, player2: UserModel): Observable<TeamModel> {
    return this.teamService.teamExists(player1.uid, player2.uid).pipe(
      filter(exists => !exists),
      switchMap(() =>
        this.teamService.register(player1.uid, player1.name, player2.uid, player2.name, uniqueNamesGenerator()))
    );
  }

  registerNewMatch() {
    this.hasRegistered = false;
  }
}
