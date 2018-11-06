import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  hasLoaded: boolean;

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.auth.isLoggedIn().subscribe(result => {
      setTimeout(() => {
        this.hasLoaded = true;
      }, 1000);
      if (!result) {
        this.router.navigate(['login']);
      }
    }, () => {
      this.hasLoaded = true;
      this.router.navigate(['login']);
    });
  }
}
