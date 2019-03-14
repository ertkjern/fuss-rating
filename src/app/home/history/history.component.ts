import {Component, OnInit} from '@angular/core';
import {HistoryService} from '../../shared/services/history.service';
import {HistoryModel} from '../../shared/models/history.model';
import {TeamHistoryModel} from '../../shared/models/team-history.model';
import {GenericHistoryModel} from '../../shared/models/generic-history.model';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-history',
  styleUrls: ['history.component.scss'],
  templateUrl: 'history.component.html'
})
export class HistoryComponent implements OnInit {

  history: GenericHistoryModel[];

  constructor(private historyService: HistoryService) {
  }

  private static convertUserHistory(history: HistoryModel): GenericHistoryModel {
    const tmp = new GenericHistoryModel();
    tmp.created = history.created;
    tmp.lastUpdated = history.lastUpdated;
    tmp.winnerName = history.player1Name;
    tmp.winnerOldRating = history.player1OldRating;
    tmp.winnerNewRating = history.player1NewRating;
    tmp.loserName = history.player2Name;
    tmp.loserOldRating = history.player2OldRating;
    tmp.loserNewRating = history.player2NewRating;
    return tmp;
  }

  private static convertTeamHistory(history: TeamHistoryModel): GenericHistoryModel {
    const tmp = new GenericHistoryModel();
    tmp.created = history.created;
    tmp.lastUpdated = history.lastUpdated;
    tmp.winnerName = history.team1Name;
    tmp.winnerOldRating = history.team1OldRating;
    tmp.winnerNewRating = history.team1NewRating;
    tmp.loserName = history.team2Name;
    tmp.loserOldRating = history.team2OldRating;
    tmp.loserNewRating = history.team2NewRating;
    return tmp;
  }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    combineLatest(this.historyService.getHistory(20), this.historyService.getTeamHistory(20)).pipe(
      map(([userHistory, teamHistory]) => {
        return userHistory.map(h => HistoryComponent.convertUserHistory(h))
          .concat(teamHistory.map(h => HistoryComponent.convertTeamHistory(h)));
      }),
    ).subscribe(history => {
      history.sort((a, b) => b.created - a.created);
      this.history = history.splice(0, 20);
    }, error => {
      console.log(error);
    });
  }

}
