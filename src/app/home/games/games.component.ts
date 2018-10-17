import {Component, OnInit} from '@angular/core';
import {MatchModel} from '../../shared/models/match.model';
import {MatchmakerService} from '../../shared/services/matchmaker.service';

@Component({
  selector: 'app-games',
  styleUrls: ['games.component.scss'],
  templateUrl: 'games.component.html'
})
export class GamesComponent implements OnInit {
  matches: MatchModel[];

  constructor(private matchmaker: MatchmakerService) {
  }

  ngOnInit() {
    this.loadMatches();
  }

  private loadMatches(){
    this.matchmaker.getMatchesByDate().subscribe(result => {
      this.matches = result;
    }, error => {
      console.log(error);
    });
  }
}
