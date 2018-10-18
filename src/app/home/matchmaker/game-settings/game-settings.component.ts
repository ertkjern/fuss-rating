import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../shared/services/user.service';
import {UserModel} from '../../../shared/models/user.model';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import {MatchmakerService} from '../../../shared/services/matchmaker.service';

@Component({
  selector: 'app-game-settings',
  styleUrls: ['game-settings.component.scss'],
  templateUrl: 'game-settings.component.html'
})
export class GameSettingsComponent implements OnInit {
  users: UserModel[];
  @Input() myId: string;
  player1: UserModel;
  player2Id: string;
  matchCreated: boolean;

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
      this.users = result.filter(u => u.uid !== id);
      this.player1 = result.filter(u => u.uid === id)[0];
      console.log(result);
    }, error => {
      console.log(error);
    });
  }

  newMatch(){
    this.matchCreated = false;
  }

  createMatch() {
    if (this.player1 && this.player2Id) {
      const oponent = this.users.filter(u => u.uid === this.player2Id)[0];
      this.matchmaker.createMatch(this.player1, oponent).then(result => {
        this.matchCreated = true;
      }, () => {
        this.matchCreated = false;
      });
    }
  }
}
