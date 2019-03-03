import {TestBed} from '@angular/core/testing';

import {MatchmakerService} from './matchmaker.service';
import {MatchModel} from '../models/match.model';
import {UserModel} from '../models/user.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {TeamMatchModel} from '../models/team-match.model';
import {TeamModel} from '../models/team.model';

const AngularFirestoreStub = {
  createId: () => 'createId',
  collection: (name: string) => ({
    valueChanges: () => 'valueChanges',
    snapshotChanges: () => 'snapshotChanges',
    doc: (_id: string) => ({
      valueChanges: () => 'valuChanges',
      set: (_d: any) => 'set',
    }),
  }),
};

const setup1v1Match = (player1Elo, player2Elo): MatchModel => {
  const match = new MatchModel();
  match.player1 = userWithRating(player1Elo);
  match.player2 = userWithRating(player2Elo);
  return match;
};

const setup2v2Match = (team1Player1Rating, team1Player2Rating, team2Player1Rating, team2Player2Rating): TeamMatchModel => {
  const match = new TeamMatchModel();
  match.team1 = teamWithRatings(team1Player1Rating, team1Player2Rating);
  match.team2 = teamWithRatings(team2Player1Rating, team2Player2Rating);
  return match;
};

const teamWithRatings = (player1Rating, player2Rating): TeamModel => {
  const team = new TeamModel();
  team.player1 = userWithRating(player1Rating);
  team.player2 = userWithRating(player2Rating);
  return team;
};

const userWithRating = (rating): UserModel => {
  const user = new UserModel();
  user.rating = rating;
  return user;
};

describe('MatchmakerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [
        MatchmakerService,
        {provide: AngularFirestore, useValue: AngularFirestoreStub},
      ]
    }).compileComponents()
  );

  it('should be created', () => {
    const service = TestBed.get(MatchmakerService);
    expect(service).toBeTruthy();
  });

  describe('calculate1v1ELORating', () => {
    it('should result in player1(1510), player2(1490)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1500, 1500);
      const actual = service['calculate1v1ELORating'](true, match);
      expect(actual.player1.rating).toEqual(1510);
      expect(actual.player2.rating).toEqual(1490);
    });

    it('should result in player1(1490), player2(1510)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1500, 1500);
      const actual = service['calculate1v1ELORating'](false, match);
      expect(actual.player1.rating).toEqual(1490);
      expect(actual.player2.rating).toEqual(1510);
    });

    it('should result in player1(1000), player2(2000)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1000, 2000);
      const actual = service['calculate1v1ELORating'](true, match);
      expect(actual.player1.rating).toEqual(1020);
      expect(actual.player2.rating).toEqual(1980);
    });

    it('should result in player1(1374), player2(1520)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1360, 1520);
      const actual = service['calculate1v1ELORating'](true, match);
      expect(actual.player1.rating).toEqual(1374);
      expect(actual.player2.rating).toEqual(1506);
    });

    it('should result in player1(1481), player2(1648)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1487, 1642);
      const actual = service['calculate1v1ELORating'](false, match);
      expect(actual.player1.rating).toEqual(1481);
      expect(actual.player2.rating).toEqual(1648);
    });
  });

  describe('calculate2v2ELORating', () => {
    it('should result in player1(1510), player2(1490)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup2v2Match(1500, 1500, 1500, 1500);
      const actual = service['calculate2v2ELORating'](true, match);
      expect(actual.team1.rating()).toEqual(1510);
      expect(actual.team1.player1.rating).toEqual(1510);
      expect(actual.team1.player2.rating).toEqual(1510);
      expect(actual.team2.rating()).toEqual(1490);
      expect(actual.team2.player1.rating).toEqual(1490);
      expect(actual.team2.player2.rating).toEqual(1490);
    });


    it('should result in player1(1490), player2(1510)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup2v2Match(1500, 1500, 1500, 1500);
      const actual = service['calculate2v2ELORating'](false, match);
      expect(actual.team1.rating()).toEqual(1490);
      expect(actual.team1.player1.rating).toEqual(1490);
      expect(actual.team1.player2.rating).toEqual(1490);
      expect(actual.team2.rating()).toEqual(1510);
      expect(actual.team2.player1.rating).toEqual(1510);
      expect(actual.team2.player2.rating).toEqual(1510);
    });

    it('should result in player1(1000), player2(2000)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup2v2Match(1000, 2000, 1400, 1600);
      const actual = service['calculate2v2ELORating'](true, match);
      expect(actual.team1.rating()).toEqual(1510);
      expect(actual.team1.player1.rating).toEqual(1010);
      expect(actual.team1.player2.rating).toEqual(2010);
      expect(actual.team2.rating()).toEqual(1490);
      expect(actual.team2.player1.rating).toEqual(1390);
      expect(actual.team2.player2.rating).toEqual(1590);
    });
  });
});
