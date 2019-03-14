import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserModel} from '../../models/user.model';

@Component({
  selector: 'app-player-selector',
  templateUrl: './player-selector.component.html',
  styleUrls: ['./player-selector.component.scss']
})
export class PlayerSelectorComponent implements OnInit {

  _player: UserModel;
  @Output() playerChange = new EventEmitter<UserModel>();
  @Input() players: UserModel[];
  @Input() disabled: UserModel[];
  @Input() label: string;
  @Input() hideLabel: boolean;
  @Input() get player() {
    return this._player;
  }

  constructor() {
  }

  isDisabled(player: UserModel) {
    return this.disabled.indexOf(player) !== -1;
  }

  ngOnInit() {
  }

  set player(val) {
    this._player = val;
    this.playerChange.emit(this._player);
  }

}
