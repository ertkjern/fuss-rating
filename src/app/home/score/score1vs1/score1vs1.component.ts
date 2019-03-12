import { Component, OnInit } from '@angular/core';
import {UserModel} from '../../../shared/models/user.model';
import {UserService} from '../../../shared/services/user.service';

@Component({
  selector: 'app-score1vs1',
  templateUrl: './score1vs1.component.html',
  styleUrls: ['./score1vs1.component.scss']
})
export class Score1vs1Component implements OnInit {
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
