import {Component, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {UserModel} from '../../shared/models/user.model';
import {MatchType} from '../../shared/models/match-type.enum';

@Component({
  selector: 'app-score',
  styleUrls: ['score.component.scss'],
  templateUrl: 'score.component.html'
})
export class ScoreComponent implements OnInit {
  matchTypes = MatchType;

  display: string;

  constructor() {
  }

  ngOnInit() {
  }

  select(type) {
    this.display = type;
  }
}
