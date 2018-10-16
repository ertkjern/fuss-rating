import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean;

  constructor(private auth: AuthenticationService) {
  }

  ngOnInit() {
    this.auth.isLoggedIn().subscribe(result => {
      if (result) {
        this.isLoggedIn = true;
      }
    });
  }

  logout(){
    this.auth.logout();
  }
}
