import {Component, OnInit} from '@angular/core';
import {HistoryService} from '../../shared/services/history.service';
import {HistoryModel} from '../../shared/models/history.model';

@Component({
  selector: 'app-history',
  styleUrls: ['history.component.scss'],
  templateUrl: 'history.component.html'
})
export class HistoryComponent implements OnInit {

  history: HistoryModel[];

  constructor(private historyService: HistoryService) {
  }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.historyService.getHistory(10).subscribe(result => {
      this.history = result;
    }, error => {
      console.log(error);
    });
  }
}
