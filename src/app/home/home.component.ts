import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  styleUrls: ['home.component.scss'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  hasLoaded: boolean;
  hasReadReleaseNote: boolean;

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  ngOnInit() {
    this.hasReadRelease();
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

  hasReadRelease() {
    const releaseRead = localStorage.getItem('fuss-release-read');
    this.hasReadReleaseNote = releaseRead === environment.version ? true : false;
  }

  close() {
    localStorage.setItem('fuss-release-read', environment.version);
    this.hasReadReleaseNote = true;
  }
}
