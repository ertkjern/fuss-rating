import {Component, OnInit} from '@angular/core';
import {uniqueNamesGenerator} from 'unique-names-generator';
import {TeamService} from '../../../../../shared/services/team.service';
import {UserService} from '../../../../../shared/services/user.service';
import {UserModel} from '../../../../../shared/models/user.model';
import {TeamModel} from '../../../../../shared/models/team.model';
import {filter, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-register-team',
  templateUrl: './register-team.component.html',
  styleUrls: ['./register-team.component.scss']
})
export class RegisterTeamComponent implements OnInit {

  private isLoading: boolean;
  private users: UserModel[];
  private teams: TeamModel[];
  private player1: UserModel;
  private player2: UserModel;

  private displayTeamExistsWarning: boolean;

  constructor(private userService: UserService, private teamService: TeamService) {
  }

  ngOnInit() {
    this.loadUsers();
    this.loadTeams();
  }

  private loadUsers() {
    this.userService.getUsersByName().subscribe(result => {
      this.users = result;
    }, err => {
      console.log(err);
    });
  }

  private loadTeams() {
    this.teamService.getTeamsByName().subscribe(result => {
      this.teams = result;
    }, err => {
      console.log(err);
    });
  }

  registerNewTeam() {
    this.teamService.teamExists(this.player1.uid, this.player2.uid).pipe(
      tap(exists => this.displayTeamExistsWarning = exists),
      filter(exists => !exists),
      switchMap(() =>
        this.teamService.register(this.player1.uid, this.player1.name, this.player2.uid, this.player2.name, uniqueNamesGenerator()))
    ).subscribe(() => {
        console.log('team registered');
      },
      (err) => console.error(err));
  }
}
