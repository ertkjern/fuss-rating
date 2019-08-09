import {Component, OnInit} from '@angular/core';
import {MatchType} from '../../shared/models/match-type.enum';

@Component({
  selector: 'app-register-match',
  templateUrl: 'register-match.component.html',
  styleUrls: ['register-match.component.scss']
})
export class RegisterMatchComponent implements OnInit {
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
