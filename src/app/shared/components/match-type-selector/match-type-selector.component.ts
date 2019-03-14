import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatchType} from '../../models/match-type.enum';

@Component({
  selector: 'app-match-type-selector',
  templateUrl: './match-type-selector.component.html',
  styleUrls: ['./match-type-selector.component.scss']
})
export class MatchTypeSelectorComponent implements OnInit {

  @Output() selected = new EventEmitter<MatchType>();
  _selected: MatchType = MatchType.ONE_VS_ONE;
  matchType = MatchType;

  constructor() {
  }

  ngOnInit() {
  }

  select(type: MatchType) {
    this._selected = type;
    this.selected.emit(this._selected);
  }
}
