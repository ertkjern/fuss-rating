import { Component, OnInit } from '@angular/core';
import {UserModel} from '../../../shared/models/user.model';
import {HistoryModel} from '../../../shared/models/history.model';
import {UserService} from '../../../shared/services/user.service';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import {MatchmakerService} from '../../../shared/services/matchmaker.service';
import {MatchModel} from '../../../shared/models/match.model';

@Component({
  selector: 'app-register1vs1-match',
  templateUrl: './register1vs1-match.component.html',
  styleUrls: ['./register1vs1-match.component.scss']
})
export class Register1vs1MatchComponent implements OnInit {
  users: UserModel[];
  player1: UserModel;
  player2: UserModel;
  matchResult: HistoryModel;
  player1Id: string;
  player2Id: string;
  isLoading: boolean;
  hasRegisterd: boolean;

  constructor(private userService: UserService, private auth: AuthenticationService, private matchmaker: MatchmakerService) {
  }

  ngOnInit() {
    this.player1Id = '';
    this.player2Id = '';
    this.auth.isLoggedIn().subscribe(result => {
      this.loadUsers(result.uid);
    }, error => {
      console.log(error);
    });
  }

  private loadUsers(id: string) {
    this.userService.getUsersByName().subscribe(result => {
      this.users = result;
    }, error => {
      console.log(error);
    });
  }

  registerWinner() {
    if (this.player2Id && this.player1Id) {
      this.player1 = this.users.filter(u => u.uid === this.player1Id)[0];
      if (confirm('Did ' + this.player1.name + ' win?')) {
        this.isLoading = true;
        this.player2 = this.users.filter(u => u.uid === this.player2Id)[0];
        const matchModel: MatchModel = this.createMatch(this.player1, this.player2);
        this.matchmaker.registerWinner(true, matchModel).then(result => {
          this.isLoading = false;
          if (result) {
            this.matchResult = result;
            this.hasRegisterd = true;
          }
        });
      } else {
        console.log('Cancel');
      }
    }
  }

  registerNewMatch() {
    this.hasRegisterd = false;
  }

  private createMatch(player1: UserModel, player2): MatchModel {
    const match: MatchModel = {
      player1: player1,
      player2: player2,
      lastUpdated: new Date(),
      created: new Date().getTime()
    };
    return match;
  }
}
