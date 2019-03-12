import {Component, OnInit} from '@angular/core';
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
  isLoading: boolean;
  hasRegisterd: boolean;

  constructor(private userService: UserService, private auth: AuthenticationService, private matchmaker: MatchmakerService) {
  }

  ngOnInit() {
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
    if (this.player1 && this.player2) {
      if (confirm('Did ' + this.player1.name + ' win?')) {
        this.isLoading = true;
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
