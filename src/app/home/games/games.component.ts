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

  registerWinner(player1Won: boolean, match: MatchModel) {
    this.matchmaker.registerWinner(player1Won, match).then(result => {
      console.log('match complete');
    }, error => {
      console.log(error);
    });
  }

  deleteMatch(match: MatchModel) {
    if (match.id) {
      if (confirm('Are you sure?')) {
        this.matchmaker.deleteMatch(match.id).then(result => {
          console.log('delted');
        }, err => {
          console.log(err);
        });
      } else {
        console.log('abort');
      }
    }
  }

  private loadMatches() {
    this.matchmaker.getMatchesByDate().subscribe(result => {
      this.matches = result;
    }, error => {
      console.log(error);
    });
  }
}
