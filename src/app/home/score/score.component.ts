import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {UserModel} from '../../shared/models/user.model';

@Component({
  selector: 'app-score',
  styleUrls: ['score.component.scss'],
  templateUrl: 'score.component.html'
})
export class ScoreComponent implements OnInit {
  users: UserModel[];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.loadScores();
  }

  private loadScores() {
    this.userService.getUsersByScore().subscribe(result => {
      this.users = result;
    }, error => {
      console.log('Something went wrong: ' + error);
    });
  }
}
