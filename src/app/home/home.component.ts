import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.auth.isLoggedIn().subscribe(result => {
      if (!result) {
        this.router.navigate(['login']);
      }
    }, () => {
      this.router.navigate(['login']);
    });
  }
}
