import { Component, OnInit } from '@angular/core';
import {TeamModel} from '../../../shared/models/team.model';
import {TeamService} from '../../../shared/services/team.service';

@Component({
  selector: 'app-score2vs2',
  templateUrl: './score2vs2.component.html',
  styleUrls: ['./score2vs2.component.scss']
})
export class Score2vs2Component implements OnInit {
  teams: TeamModel[];

  constructor(private teamService: TeamService) {
  }

  ngOnInit() {
    this.loadScores();
  }

  private loadScores() {
    this.teamService.getTeamsByScore().subscribe(result => {
      this.teams = result;
    }, error => {
      console.log('Something went wrong: ' + error);
    });
  }
}
